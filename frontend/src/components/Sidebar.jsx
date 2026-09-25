import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusSquare, History, Settings, Workflow } from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/create', label: 'Create Diagram', icon: PlusSquare },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-base-800/60 backdrop-blur-md px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20">
          <Workflow size={18} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight">UML Generator</p>
          <p className="text-xs text-slate-500 leading-tight">AI Diagram Studio</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 text-white border border-white/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto glass-card p-4 text-xs text-slate-400">
        <p className="font-medium text-slate-200 mb-1">College SE / AI Demo</p>
        <p>Requirements → Gemini → Mermaid → UML diagrams, rendered live.</p>
      </div>
    </aside>
  )
}
