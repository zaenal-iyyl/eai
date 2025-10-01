'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [light, setLight] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return (
    <button
      onClick={() => setLight(l => {
        const n = !l
        document.documentElement.classList.toggle('light', n)
        return n
      })}
      className="px-3 py-1 rounded border border-slate-700 text-xs"
    >
      {light ? 'Dark' : 'Light'}
    </button>
  )
}
