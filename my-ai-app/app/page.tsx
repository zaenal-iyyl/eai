import dynamic from 'next/dynamic'
const ChatBox = dynamic(() => import('@/components/ChatBox'), { ssr: false })

export default function Page() {
  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">AI Chat (aj)</h1>
      <p className="text-sm text-gray-300 mb-6">
        Ketik pertanyaanmu. 
      </p>
      <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800">
        <ChatBox />
      </div>
    </section>
  )
}
