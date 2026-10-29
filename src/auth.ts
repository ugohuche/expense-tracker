import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { LoginFormSchema } from "@/lib/definitions";
import { getSessionVersion, isSessionStale } from "@/lib/session-invalidation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginFormSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.passwordHash,
        );
        if (!passwordsMatch) {
          return null;
        }

        // The version is read in the same query as the password hash, so a
        // login that checked the old password always gets the old version.
        const sessionUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          sessionVersion: user.sessionVersion,
        };
        return sessionUser;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sessionVersion =
          "sessionVersion" in user && typeof user.sessionVersion === "number"
            ? user.sessionVersion
            : 0;
        return token;
      }

      // Every password change bumps the user's session version, so tokens
      // issued for an older version are rejected.
      if (typeof token.id === "string") {
        const tokenVersion =
          typeof token.sessionVersion === "number"
            ? token.sessionVersion
            : undefined;
        const currentVersion = await getSessionVersion(token.id);
        if (isSessionStale(tokenVersion, currentVersion)) {
          return null;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
