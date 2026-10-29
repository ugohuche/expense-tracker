import { prisma } from "@/lib/prisma";

/**
 * Cache TTL for the `sessionVersion` lookup that happens on every session
 * read. Keeps the extra query off the hot path while staying fresh enough.
 */
const CACHE_TTL_MS = 5_000;

type CacheEntry = {
  value: number | null;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

/**
 * Reads only the `sessionVersion` column of a user (primary key lookup).
 * The result is memoised for a few seconds.
 */
export async function getSessionVersion(
  userId: string,
): Promise<number | null> {
  const now = Date.now();
  const cached = cache.get(userId);

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sessionVersion: true },
  });

  const value = user ? user.sessionVersion : null;
  cache.set(userId, { value, expiresAt: now + CACHE_TTL_MS });

  return value;
}

/**
 * Called right after a password change so the next session check already sees
 * the new value instead of the memoised one.
 */
export function setSessionVersionCache(userId: string, version: number): void {
  cache.set(userId, { value: version, expiresAt: Date.now() + CACHE_TTL_MS });
}

/**
 * A session is stale when it was issued for an older session version. The
 * version is bumped on every password change, so this does not depend on
 * timing: a session from before the change is always rejected and a login
 * after it is always accepted. Tokens without a version count as version 0.
 *
 * The check is `<` rather than `!==` so a token that is newer than a memoised
 * value (for example a fresh login on another server) is not rejected.
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
