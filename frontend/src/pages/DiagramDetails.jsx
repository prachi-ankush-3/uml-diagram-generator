import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Eye, Code2, AlertCircle } from 'lucide-react'
import DiagramViewer from '../components/DiagramViewer.jsx'
import MermaidEditor from '../components/MermaidEditor.jsx'
import Loading from '../components/Loading.jsx'
import { diagramApi } from '../services/api.js'

export default function DiagramDetails() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [diagram, setDiagram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [activeTab, setActiveTab] = useState(searchParams.get('edit') ? 'code' : 'preview')
  const [editableCode, setEditableCode] = useState('')
  const [renderedCode, setRenderedCode] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    diagramApi
      .getOne(id)
      .then((d) => {
        setDiagram(d)
        setEditableCode(d.mermaid_code)
        setRenderedCode(d.mermaid_code)
      })
      .catch((err) => setErrorMsg(err.friendlyMessage || 'Diagram not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRender = () => setRenderedCode(editableCode)

  const handleSave = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    setIsSaving(true)
    try {
      const updated = await diagramApi.update(id, { mermaid_code: editableCode })
      setDiagram(updated)
      setRenderedCode(updated.mermaid_code)
      setSuccessMsg('Changes saved.')
    } catch (err) {
      setErrorMsg(err.friendlyMessage || 'Could not save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <Loading label="Loading diagram..." />

  if (errorMsg && !diagram) {
    return (
      <div className="glass-card p-8 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="text-amber-400" size={28} />
        <p className="text-slate-300">{errorMsg}</p>
        <button onClick={() => navigate('/history')} className="btn-secondary mt-2">
          <ArrowLeft size={16} /> Back to History
        </button>
      </div>
    )
  }

  return (
    <div className="fade-in space-y-5 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/history')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to History
        </button>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary !py-2 !px-4 text-sm">
          <Save size={15} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold">{diagram.project_name}</h2>
        <p className="text-sm text-slate-500 capitalize">{diagram.diagram_type} diagram</p>
      </div>

      {successMsg && <div className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-3 py-2.5">{successMsg}</div>}
      {errorMsg && <div className="text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2.5">{errorMsg}</div>}

      <div className="glass-card p-6 flex-1 flex flex-col min-h-[500px]">
        <div className="flex items-center gap-1 mb-4 bg-base-700/50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'preview' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye size={14} /> Visual Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'code' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 size={14} /> Mermaid Code
          </button>
        </div>

        <div className="flex-1 min-h-0">
          {activeTab === 'preview' ? (
            <DiagramViewer mermaidCode={renderedCode} projectName={diagram.project_name} diagramType={diagram.diagram_type} />
          ) : (
            <MermaidEditor code={editableCode} onChange={setEditableCode} onRender={handleRender} />
          )}
        </div>
      </div>
    </div>
  )
}
