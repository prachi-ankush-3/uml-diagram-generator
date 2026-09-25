import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Boxes, Users, ArrowLeftRight, Workflow, Component, CircleDotDashed,
  Plus, Clock, ArrowRight,
} from 'lucide-react'
import DiagramCard from '../components/DiagramCard.jsx'
import Loading from '../components/Loading.jsx'
import { diagramApi } from '../services/api.js'

const diagramTypeCards = [
  { type: 'class', label: 'Class Diagram', Icon: Boxes, description: 'Classes, attributes, methods and relationships.' },
  { type: 'usecase', label: 'Use Case Diagram', Icon: Users, description: 'Actors and the use cases they interact with.' },
  { type: 'sequence', label: 'Sequence Diagram', Icon: ArrowLeftRight, description: 'Message flow between objects over time.' },
  { type: 'activity', label: 'Activity Diagram', Icon: Workflow, description: 'Workflows, decisions and process steps.' },
  { type: 'component', label: 'Component Diagram', Icon: Component, description: 'System components and their dependencies.' },
  { type: 'state', label: 'State Diagram', Icon: CircleDotDashed, description: 'States and transitions of an object.' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    diagramApi
      .getAll()
      .then((data) => setRecent((data.diagrams || []).slice(0, 5)))
      .catch((err) => setErrorMsg(err.friendlyMessage || 'Could not load recent diagrams.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fade-in space-y-10">
      <div className="glass-card p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">UML Diagram Generator</h2>
          <p className="text-slate-400 max-w-xl">
            Describe your software requirements in plain language, and let AI turn them into
            professional UML diagrams — class, use case, sequence, activity, component and state.
          </p>
        </div>
        <button onClick={() => navigate('/create')} className="btn-primary shrink-0">
          <Plus size={18} /> Create New Diagram
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Diagram Types</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagramTypeCards.map((card) => (
            <DiagramCard key={card.type} {...card} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Recent Diagrams</h3>
          <button onClick={() => navigate('/history')} className="text-sm text-accent-blue hover:text-accent-purple flex items-center gap-1">
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading && <Loading label="Loading recent diagrams..." />}
        {!loading && errorMsg && <p className="text-sm text-amber-400">{errorMsg}</p>}
        {!loading && !errorMsg && recent.length === 0 && (
          <div className="glass-card p-6 text-sm text-slate-400 flex items-center gap-3">
            <Clock size={18} /> No diagrams yet. Create your first one above.
          </div>
        )}
        {!loading && recent.length > 0 && (
          <div className="glass-card divide-y divide-white/5">
            {recent.map((d) => (
              <button
                key={d.id}
                onClick={() => navigate(`/diagram/${d.id}`)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-100">{d.project_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 capitalize">{d.diagram_type} diagram</p>
                </div>
                <span className="text-xs text-slate-500">
                  {d.created_at ? new Date(d.created_at).toLocaleDateString() : ''}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
