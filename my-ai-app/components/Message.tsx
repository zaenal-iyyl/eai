export default function Message({ role, text }: { role: 'user'|'assistant'|'source', text: string }) {
  const bg = role === 'user'
    ? 'bg-blue-600 text-white'
    : role === 'source'
      ? 'bg-emerald-900/40 text-emerald-100 border border-emerald-800'
      : 'bg-slate-800 text-slate-100'
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`${bg} max-w-[85%] px-4 py-3 rounded-xl whitespace-pre-wrap text-sm`}>
        {text}
      </div>
    </div>
  )
}
