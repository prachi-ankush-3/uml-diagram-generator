import { Search, User } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-4 border-b border-white/5 bg-base-900/70 backdrop-blur-md">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">UML Diagram Generator</h1>
      </div>
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search diagrams..."
            className="input-field !py-2 !pl-9 text-sm"
          />
        </div>
      </div>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
        <User size={16} className="text-white" />
      </div>
    </header>
  )
}
