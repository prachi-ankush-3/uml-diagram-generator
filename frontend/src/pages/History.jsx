import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2, Download, Search, Inbox } from 'lucide-react'
import Loading from '../components/Loading.jsx'
import { diagramApi } from '../services/api.js'

export default function History() {
  const navigate = useNavigate()
  const [diagrams, setDiagrams] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [query, setQuery] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    diagramApi
      .getAll()
      .then((data) => setDiagrams(data.diagrams || []))
      .catch((err) => setErrorMsg(err.friendlyMessage || 'Could not load diagram history.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this diagram? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await diagramApi.remove(id)
      setDiagrams((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      setErrorMsg(err.friendlyMessage || 'Could not delete diagram.')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = diagrams.filter((d) =>
    `${d.project_name} ${d.diagram_type}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Diagram History</h2>
          <p className="text-sm text-slate-500 mt-1">All diagrams you've saved, with full Mermaid source stored for later editing.</p>
        </div>
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by project or type..."
            className="input-field !py-2 !pl-9 text-sm"
          />
        </div>
      </div>

      {loading && <Loading label="Loading history..." />}
      {!loading && errorMsg && <p className="text-sm text-amber-400">{errorMsg}</p>}

      {!loading && !errorMsg && filtered.length === 0 && (
        <div className="glass-card p-10 flex flex-col items-center text-center gap-2 text-slate-500">
          <Inbox size={28} />
          <p className="text-sm">No diagrams found. Create one from the Dashboard.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-white/10">
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Diagram Type</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-100">{d.project_name}</td>
                  <td className="px-5 py-3.5 capitalize text-slate-400">{d.diagram_type}</td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {d.created_at ? new Date(d.created_at).toLocaleString() : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => navigate(`/diagram/${d.id}`)} title="View" className="btn-secondary !p-2">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => navigate(`/diagram/${d.id}?edit=1`)} title="Edit" className="btn-secondary !p-2">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => navigate(`/diagram/${d.id}`)} title="Download" className="btn-secondary !p-2">
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        disabled={deletingId === d.id}
                        title="Delete"
                        className="btn-secondary !p-2 hover:!border-red-400/40 hover:!text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
