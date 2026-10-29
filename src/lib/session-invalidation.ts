import { prisma } from "@/lib/prisma";

/**
 * Reads only the `sessionVersion` column of a user (primary key lookup).
 */
export async function getSessionVersion(
  userId: string,
): Promise<number | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sessionVersion: true },
  });

  return user ? user.sessionVersion : null;
}

/**
 * A session is stale when it was issued for an older session version. The
 * version is bumped on every password change, so this does not depend on
 * timing: a session from before the change is always rejected and a login
 * after it is always accepted. Tokens without a version count as version 0.
 *
 * The check is `<` rather than `!==` so a token with a newer version is not
 * rejected if a password change races with the session check.
 */
export function isSessionStale(
  tokenVersion: number | undefined,
  currentVersion: number | null,
): boolean {
  if (currentVersion === null) {
    return false;
  }

  return (tokenVersion ?? 0) < currentVersion;
}
