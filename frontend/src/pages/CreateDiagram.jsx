import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Sparkles, Save, AlertCircle, Eye, Code2 } from 'lucide-react'
import DiagramViewer from '../components/DiagramViewer.jsx'
import MermaidEditor from '../components/MermaidEditor.jsx'
import { diagramApi, diagramTypes } from '../services/api.js'

const SAMPLE_PROJECTS = {
  'E-Commerce System': 'Build an e-commerce system. Customers can browse products, add items to a cart, place orders and make payments. Admins can manage the product catalog and view sales reports. Include a Product, Cart, Order, Payment and User class.',
  'Library Management System': 'Design a library management system. Members can search the catalog, borrow books and return books. Librarians can add books, remove books and manage member records. Track due dates and fines for overdue books.',
  'Hospital Management System': 'Create a hospital management system. Patients can register, book appointments and view medical records. Doctors can view their schedule and update patient diagnoses. Admin staff manage billing and staff records.',
}

export default function CreateDiagram() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [diagramType, setDiagramType] = useState(searchParams.get('type') || 'class')
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [sourceCode, setSourceCode] = useState('')
  const [mermaidCode, setMermaidCode] = useState('')
  const [editableCode, setEditableCode] = useState('')

  const [activeTab, setActiveTab] = useState('preview') // preview | code
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const t = searchParams.get('type')
    if (t) setDiagramType(t)
  }, [searchParams])

  const clearMessages = () => {
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleGenerate = async () => {
    clearMessages()
    if (!description.trim()) {
      setErrorMsg('Please enter project requirements first.')
      return
    }
    setIsGenerating(true)
    try {
      const result = await diagramApi.generate({
        project_name: projectName.trim() || 'Untitled Project',
        diagram_type: diagramType,
        description: description.trim(),
        source_code: sourceCode.trim(),
      })
      setMermaidCode(result.mermaid_code)
      setEditableCode(result.mermaid_code)
      setSuccessMsg(result.message)
      setActiveTab('preview')
    } catch (err) {
      setErrorMsg(err.friendlyMessage || 'Unable to generate the diagram. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRenderManual = () => {
    clearMessages()
    setMermaidCode(editableCode)
    setActiveTab('preview')
  }

  const handleSave = async () => {
    clearMessages()
    if (!mermaidCode.trim()) {
      setErrorMsg('Generate or write a diagram before saving.')
      return
    }
    setIsSaving(true)
    try {
      await diagramApi.save({
        project_name: projectName.trim() || 'Untitled Project',
        diagram_type: diagramType,
        description: description.trim(),
        source_code: sourceCode.trim(),
        mermaid_code: mermaidCode,
      })
      setSuccessMsg('Diagram saved to history.')
    } catch (err) {
      setErrorMsg(err.friendlyMessage || 'Unable to save the diagram.')
    } finally {
      setIsSaving(false)
    }
  }

  const loadSample = (name) => {
    setProjectName(name)
    setDescription(SAMPLE_PROJECTS[name])
  }

  return (
    <div className="fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left: input panel */}
      <div className="glass-card p-6 flex flex-col gap-4 overflow-y-auto">
        <div>
          <h2 className="text-lg font-semibold">Create New Diagram</h2>
          <p className="text-sm text-slate-500 mt-1">Describe your system and let AI generate the UML diagram.</p>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Diagram Type</label>
          <select
            value={diagramType}
            onChange={(e) => setDiagramType(e.target.value)}
            className="input-field"
          >
            {diagramTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Food Delivery System"
            className="input-field"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Requirements / Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder='e.g. "Create an online food delivery system. Users can register, login, browse restaurants, add food to cart, place orders and make payments."'
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Source Code (optional)</label>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            rows={4}
            placeholder="Paste existing class/interface code to base the diagram on..."
            className="input-field resize-none font-mono text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(SAMPLE_PROJECTS).map((name) => (
            <button
              key={name}
              onClick={() => loadSample(name)}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2.5">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-3 py-2.5">
            {successMsg}
          </div>
        )}

        <div className="flex gap-3 mt-auto pt-2">
          <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary flex-1">
            <Sparkles size={16} /> {isGenerating ? 'Generating...' : 'Generate Diagram'}
          </button>
          <button onClick={handleSave} disabled={isSaving || !mermaidCode} className="btn-secondary">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Right: preview / editor */}
      <div className="glass-card p-6 flex flex-col min-h-[500px]">
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
            <DiagramViewer mermaidCode={mermaidCode} projectName={projectName} diagramType={diagramType} />
          ) : (
            <MermaidEditor code={editableCode} onChange={setEditableCode} onRender={handleRenderManual} />
          )}
        </div>
      </div>
    </div>
  )
}
