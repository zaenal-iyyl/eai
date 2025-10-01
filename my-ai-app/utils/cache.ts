
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5 
})

export function getCached(key: string) {
  return cache.get(key)
}

export function setCached(key: string, value: any) {
  cache.set(key, value)
}
