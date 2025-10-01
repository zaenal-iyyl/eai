import LRU from 'lru-cache'
const cache = new LRU<string, string>({ max: 1000, ttl: 5 * 60_000 })
export function getCached(k: string) { return cache.get(k) }
export function setCached(k: string, v: string) { cache.set(k, v) }
