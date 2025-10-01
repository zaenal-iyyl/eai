'use client'
import { useRef, useState } from 'react'
import Message from './Message'

type Msg = { id: string; role: 'user'|'assistant'|'source'; text: string }

export default function ChatBox(){
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const sc = useRef<HTMLDivElement|null>(null)

  const push = (m: Msg) => {
    setMessages(s => [...s, m])
    setTimeout(() => sc.current?.scrollTo({ top: sc.current.scrollHeight, behavior: 'smooth' }), 30)
  }

  const send = async () => {
    const prompt = input.trim()
    if (!prompt) return
    const uid = Date.now().toString()
    push({ id: uid+'-u', role: 'user', text: prompt })
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (data.sourceSummary) {
        push({ id: uid+'-src', role: 'source', text: data.sourceSummary })
      }
      push({ id: uid+'-a', role: 'assistant', text: data.result || data.error || 'Tidak ada hasil.' })
    } catch {
      push({ id: uid+'-err', role: 'assistant', text: 'Terjadi kesalahan koneksi.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={sc} className="h-96 overflow-y-auto p-3 bg-slate-900 rounded-lg border border-slate-800">
        {messages.length === 0
          ? <div className="text-slate-400 text-sm">Tulis pertanyaan apa saja. Fakta (2025/presiden/dst) → Wikipedia. Lainnya → DeepSeek.</div>
          : messages.map(m => <Message key={m.id} role={m.role} text={m.text} />)
        }
      </div>

      <div className="flex items-center gap-3">
        <textarea
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          rows={2}
          className="flex-1 p-3 rounded border border-slate-700 bg-slate-800 text-white"
          placeholder="Tulis pertanyaanmu..."
        />
        <div className="flex flex-col gap-2">
          <button onClick={send} disabled={loading} className="px-4 py-2 bg-primary rounded disabled:opacity-50">
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>
          <button onClick={()=>setMessages([])} className="px-4 py-2 border rounded text-sm text-slate-300">Clear</button>
        </div>
      </div>
    </div>
  )
}
