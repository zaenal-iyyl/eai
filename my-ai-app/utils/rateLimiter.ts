import { LRUCache } from 'lru-cache'

const rateLimitCache = new LRUCache<string, { count: number; last: number }>({
  max: 1000,
  ttl: 1000 * 60 // 1 menit
})

export function checkRateLimit(ip: string, limit = 10) {
  const now = Date.now()
  const entry = rateLimitCache.get(ip)

  if (!entry) {
    rateLimitCache.set(ip, { count: 1, last: now })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count += 1
  entry.last = now
  rateLimitCache.set(ip, entry)
  return true
}
