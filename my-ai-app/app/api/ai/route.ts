import { NextResponse } from 'next/server'
import { askDeepSeek, isFactQuestion, searchWikipedia } from '@/lib/gptScraper'
import { checkRateLimit } from '@/utils/rateLimiter'
import { getCached, setCached } from '@/utils/cache'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const ip = (req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'anon') as string
    const rl = checkRateLimit(ip)
    if (!rl.ok) {
      return NextResponse.json({ error: 'Rate limit exceeded', resetAt: rl.resetAt }, { status: 429 })
    }

    const { prompt } = await req.json() as { prompt?: string }
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt wajib diisi.' }, { status: 400 })
    }
    const q = prompt.trim()
    const cacheKey = `qa:${q.toLowerCase()}`
    const cached = getCached(cacheKey)
    if (cached) return NextResponse.json(JSON.parse(cached))

    if (isFactQuestion(q)) {
      let lookup = q
      const lowered = q.toLowerCase()
      if (lowered.includes('tahun sekarang') || lowered.includes('tahun ini')) {
        lookup = `${new Date().getFullYear()}`
      }
      if (lowered.includes('presiden indo') || lowered.includes('presiden indonesia')) {
        lookup = 'Presiden Indonesia'
      }
      const wiki = await searchWikipedia(lookup)
      if (!wiki.ok) {
        const fallback = { result: `Maaf, ${wiki.error}`, sourceSummary: null }
        setCached(cacheKey, JSON.stringify(fallback))
        return NextResponse.json(fallback)
      }
      const payload = { result: wiki.summary, sourceSummary: 'Sumber: Wikipedia Indonesia', sourceUrl: wiki.url }
      setCached(cacheKey, JSON.stringify(payload))
      return NextResponse.json(payload)
    }

    const answer = await askDeepSeek(q)
    const payload = { result: answer, sourceSummary: null }
    setCached(cacheKey, JSON.stringify(payload))
    return NextResponse.json(payload)
  } catch (e:any) {
    console.error('api/ai error:', e?.message || e)
    return NextResponse.json({ error: 'Terjadi kesalahan di server.' }, { status: 500 })
  }
}
