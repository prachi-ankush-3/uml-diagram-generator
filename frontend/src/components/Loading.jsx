import { Loader2 } from 'lucide-react'

export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400 fade-in">
      <Loader2 size={28} className="animate-spin text-accent-blue" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
