import axios from 'axios'
import * as cheerio from 'cheerio'

const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.yescale.io/v1/chat/completions'
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v3-0324'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''

export function isFactQuestion(q: string) {
  const s = q.toLowerCase()
  const currentYear = new Date().getFullYear().toString()
  const factKeywords = [
    'presiden', 'wakil presiden', 'tahun sekarang', 'tahun ini',
    'siapa presiden', 'kapan', 'berapa', 'ibukota', 'mata uang',
    '2025', currentYear
  ]
  return factKeywords.some(k => s.includes(k))
}

export async function searchWikipedia(query: string) {
  try {
    const encoded = encodeURIComponent(query)
    const url = `https://id.m.wikipedia.org/wiki/${encoded}`
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const $ = cheerio.load(data)
    const description = $('#mf-section-0').find('p').text().trim()
    const thumb = $('meta[property="og:image"]').attr('content') || ''
    if (!description) return { ok:false, error: 'Informasi tidak ditemukan di Wikipedia.' }
    const title = $('title').text() || query
    const summary = `📚 Wikipedia: ${title}\n\n${description}\n\n🔗 ${url}`
    return { ok:true, summary, thumb, url }
  } catch (e:any) {
    return { ok:false, error: e.message || 'error' }
  }
}

export async function askDeepSeek(prompt: string) {
  try {
    const headers: Record<string,string> = { 'Content-Type': 'application/json' }
    if (DEEPSEEK_API_KEY) headers['Authorization'] = `Bearer ${DEEPSEEK_API_KEY}`
    const payload = {
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Answer in Indonesian if user asks in Indonesian.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
      temperature: 0.7
    }
    const { data } = await axios.post(DEEPSEEK_API_URL, payload, { headers, timeout: 30000 })
    const text = data?.choices?.[0]?.message?.content ?? data?.result ?? '[No response from DeepSeek]'
    return text as string
  } catch (e:any) {
    return 'Gagal menghubungi DeepSeek.'
  }
}
