import ThemeToggle from './ThemeToggle'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-slate-800 sticky top-0 bg-[#0b1220]/70 backdrop-blur z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-bold">AI</div>
          <div className="leading-tight">
            <div className="text-base font-semibold">AI Chat</div>
            <div className="text-[10px] text-slate-400">Wikipedia • DeepSeek</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
