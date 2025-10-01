const requests = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string) {
  const limit = 5
  const windowMs = 60 * 1000
  const now = Date.now()
  const entry = requests.get(ip)

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs })
    return { ok: true, resetAt: now + windowMs }
  }

  if (entry.count < limit) {
    entry.count++
    requests.set(ip, entry)
    return { ok: true, resetAt: entry.resetAt }
  }

  return { ok: false, resetAt: entry.resetAt }
}
