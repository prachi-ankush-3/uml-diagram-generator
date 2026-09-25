import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function DiagramCard({ type, label, description, Icon }) {
  const navigate = useNavigate()
  return (
    <div className="glass-card p-5 flex flex-col gap-3 group">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-white/10 flex items-center justify-center">
        <Icon size={20} className="text-accent-blue group-hover:text-accent-purple transition-colors" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-100">{label}</h3>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={() => navigate(`/create?type=${type}`)}
        className="mt-2 self-start flex items-center gap-1.5 text-sm font-medium text-accent-blue hover:text-accent-purple transition-colors"
      >
        Create <ArrowRight size={14} />
      </button>
    </div>
  )
}
