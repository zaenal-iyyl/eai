
import { LRUCache } from "lru-cache"

const rateLimitCache = new LRUCache<string, { count: number; lastRequest: number }>({
  max: 500,
  ttl: 1000 * 60
})

export function rateLimiter(identifier: string, limit: number, windowMs: number) {
  const now = Date.now()
  const existing = rateLimitCache.get(identifier)

  if (existing) {
    if (now - existing.lastRequest < windowMs) {
      if (existing.count >= limit) {
        return false
      }
      existing.count += 1
      rateLimitCache.set(identifier, existing)
      return true
    }
  }

  rateLimitCache.set(identifier, { count: 1, lastRequest: now })
  return true
}
