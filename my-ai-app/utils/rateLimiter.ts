import { LRUCache } from "lru-cache";

const tokenCache = new LRUCache<string, { tokens: number; last: number }>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 jam
});

export function rateLimiter(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const entry = tokenCache.get(key);

  if (!entry) {
    tokenCache.set(key, { tokens: limit - 1, last: Date.now() });
    return true;
  }

  const now = Date.now();
  const elapsed = now - entry.last;
  const refill = Math.floor(elapsed / windowMs);

  if (refill > 0) {
    entry.tokens = Math.min(limit, entry.tokens + refill);
    entry.last = now;
  }

  if (entry.tokens > 0) {
    entry.tokens -= 1;
    tokenCache.set(key, entry);
    return true;
  }

  return false;
}
