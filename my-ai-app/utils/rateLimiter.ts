import LRU from 'lru-cache'
const RATE = Number(process.env.RATE_LIMIT_PER_MIN || 30)
type Entry = { count: number; resetAt: number }
const cache = new LRU<string, Entry>({ max: 5000, ttl: 60_000 })
export function checkRateLimit(key: string) {
  const now = Date.now()
  const cur = cache.get(key)
  if (!cur) { cache.set(key, { count:1, resetAt: now+60_000 }); return { ok:true, remaining: RATE-1, resetAt: now+60_000 } }
  if (cur.count >= RATE) return { ok:false, remaining:0, resetAt: cur.resetAt }
  cur.count += 1; cache.set(key, cur)
  return { ok:true, remaining: RATE - cur.count, resetAt: cur.resetAt }
}
