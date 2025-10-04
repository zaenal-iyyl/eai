import { LRUCache } from "lru-cache"

const cache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 5
})

export function getCached(key: string): string | undefined {
  return cache.get(key)
}

export function setCached(key: string, value: any) {
  cache.set(key, JSON.stringify(value))
}
