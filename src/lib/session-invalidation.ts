import { prisma } from "@/lib/prisma";

/**
 * Cache TTL for the `passwordChangedAt` lookup that happens on every session
 * read. Keeps the extra query off the hot path while staying fresh enough.
 */
const CACHE_TTL_MS = 5_000;

type CacheEntry = {
  value: number | null;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

/**
 * Reads only the `passwordChangedAt` column of a user (primary key lookup).
 * The result is memoised for a few seconds.
 */
export async function getPasswordChangedAt(userId: string): Promise<Date | null> {
  const now = Date.now();
  const cached = cache.get(userId);

  if (cached && cached.expiresAt > now) {
    return cached.value === null ? null : new Date(cached.value);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordChangedAt: true },
  });

  const value = user?.passwordChangedAt ? user.passwordChangedAt.getTime() : null;
  cache.set(userId, { value, expiresAt: now + CACHE_TTL_MS });

  return value === null ? null : new Date(value);
}

/**
 * Called right after a password change so the next session check already sees
 * the new value instead of the memoised one.
 */
export function setPasswordChangedAtCache(userId: string, changedAt: Date): void {
  cache.set(userId, {
    value: changedAt.getTime(),
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * A session is stale when it was issued before the password was changed.
 * `token.iat` is in seconds, so the change time is floored to seconds as well:
 * a token issued in the same second as the change is kept, which makes logins
 * that happen right after a reset keep working.
 */
export function isSessionStale(
  issuedAt: number | undefined,
  passwordChangedAt: Date | null,
): boolean {
  if (typeof issuedAt !== "number" || !passwordChangedAt) {
    return false;
  }

  return issuedAt < Math.floor(passwordChangedAt.getTime() / 1000);
}
