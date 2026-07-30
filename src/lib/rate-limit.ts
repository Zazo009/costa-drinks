/**
 * Lightweight in-memory rate limiter. Good enough to blunt rapid-fire abuse
 * from a single warm serverless instance; it does not coordinate across
 * instances/regions, so it's not a substitute for a real store (e.g.
 * Upstash Redis) if abuse becomes a real problem.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() ?? 'unknown';
}
