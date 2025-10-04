import { LRUCache } from "lru-cache"

const rateLimitCache = new LRUCache<string, { count: number; lastRequest: number }>({
  max: 500,
  ttl: 1000 * 60
})

export function checkRateLimit(identifier: string, limit = 5, windowMs = 60_000) {
  const now = Date.now()
  const existing = rateLimitCache.get(identifier)

  if (existing) {
    if (now - existing.lastRequest < windowMs) {
      if (existing.count >= limit) {
        return { ok: false, resetAt: existing.lastRequest + windowMs }
      }
      existing.count += 1
      rateLimitCache.set(identifier, existing)
      return { ok: true }
    }
  }

  rateLimitCache.set(identifier, { count: 1, lastRequest: now })
  return { ok: true }
}
