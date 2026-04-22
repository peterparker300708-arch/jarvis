const bucket = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max = 30, windowMs = 60_000) {
  const now = Date.now();
  const entry = bucket.get(key);

  if (!entry || entry.resetAt <= now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  bucket.set(key, entry);

  return { allowed: true, remaining: max - entry.count };
}
