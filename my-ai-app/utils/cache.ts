
import { LRUCache } from "lru-cache"

const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 5
})

export function getCached<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined
}

export function setCached<T>(key: string, value: T) {
  cache.set(key, value)
}
