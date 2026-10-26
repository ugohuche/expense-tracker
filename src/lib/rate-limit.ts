import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";

const HOUR_MS = 60 * 60 * 1000;

export const RATE_LIMIT_MESSAGE = "Too many attempts, please try again later.";

/**
 * Reads the client IP from the request headers. `x-forwarded-for` may hold a
 * comma separated chain, the first entry is the original client. Anything
 * missing or malformed falls back to a shared bucket.
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const first = forwarded?.split(",")[0]?.trim();
    if (first && first.length <= 64) {
      return first;
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

type RateLimitOptions = {
  scope: string;
  identifier: string;
  limit: number;
  windowMs?: number;
};

/**
 * Fixed window rate limiter backed by the database.
 *
 * The row key contains the scope, the identifier and the end of the current
 * window, so a new window automatically starts a fresh counter. Counters are
 * incremented for every attempt, whether or not the attempt succeeds, so the
 * limiter cannot be used to probe for valid data.
 */
export async function checkRateLimit({
  scope,
  identifier,
  limit,
  windowMs = HOUR_MS,
}: RateLimitOptions): Promise<{ limited: boolean; count: number }> {
  const now = Date.now();
  const windowEnd = new Date(Math.ceil(now / windowMs) * windowMs);
  const key = `${scope}:${identifier}:${windowEnd.getTime()}`;

  const row = await prisma.rateLimit.upsert({
    where: { key },
    create: { key, count: 1, windowEnd },
    update: { count: { increment: 1 } },
    select: { count: true },
  });

  if (row.count === 1) {
    await pruneRateLimits(scope, identifier, now);
  }

  return { limited: row.count > limit, count: row.count };
}

/**
 * Removes counters of finished windows so the table does not grow forever.
 * Only the counters of the same scope/identifier are pruned, plus a small
 * chance of a global sweep.
 */
async function pruneRateLimits(
  scope: string,
  identifier: string,
  now: number,
): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({
      where: {
        key: { startsWith: `${scope}:${identifier}:` },
        windowEnd: { lt: new Date(now) },
      },
    });

    if (Math.random() < 0.05) {
      await prisma.rateLimit.deleteMany({
        where: { windowEnd: { lt: new Date(now) } },
      });
    }
  } catch {
    // Pruning is best effort and must never break the request.
  }
}
