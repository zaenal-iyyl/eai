export default function Footer(){
  return (
    <footer className="border-t border-slate-800">
      <div className="container mx-auto px-4 py-4 text-xs text-slate-400 flex justify-between">
        <div>© {new Date().getFullYear()} my-ai-app</div>
        <div>Respect robots.txt • Taat ToS sumber</div>
      </div>
    </footer>
  )
}
