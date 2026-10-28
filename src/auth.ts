import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { LoginFormSchema } from "@/lib/definitions";
import {
  getPasswordChangedAt,
  isSessionStale,
} from "@/lib/session-invalidation";

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

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.authTime = Math.floor(Date.now() / 1000);
        return token;
      }

      // `iat` is refreshed every time the token is re-signed, so the sign-in
      // time is tracked separately. Tokens issued before `authTime` existed
      // count as signed in at 0, so a password change still revokes them.
      if (typeof token.id === "string") {
        const authTime =
          typeof token.authTime === "number" ? token.authTime : 0;
        const passwordChangedAt = await getPasswordChangedAt(token.id);
        if (isSessionStale(authTime, passwordChangedAt)) {
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
