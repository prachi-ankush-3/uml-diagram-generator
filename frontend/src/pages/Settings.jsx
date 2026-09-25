import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, KeyRound, Server } from 'lucide-react'
import { diagramApi } from '../services/api.js'

export default function Settings() {
  const [health, setHealth] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    diagramApi
      .health()
      .then(setHealth)
      .catch(() => setErrorMsg('Backend is not reachable. Make sure it is running on the configured URL.'))
  }, [])

  return (
    <div className="fade-in space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">System status and configuration reference.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Server size={18} className="text-accent-blue" />
          <div className="flex-1">
            <p className="font-medium text-sm">Backend connection</p>
            <p className="text-xs text-slate-500">FastAPI server health</p>
          </div>
          {errorMsg ? (
            <span className="flex items-center gap-1.5 text-sm text-red-400"><XCircle size={16} /> Offline</span>
          ) : health ? (
            <span className="flex items-center gap-1.5 text-sm text-emerald-400"><CheckCircle2 size={16} /> Online</span>
          ) : (
            <span className="text-sm text-slate-500">Checking...</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <KeyRound size={18} className="text-accent-purple" />
          <div className="flex-1">
            <p className="font-medium text-sm">Gemini API key</p>
            <p className="text-xs text-slate-500">Configured via backend/.env</p>
          </div>
          {health ? (
            health.gemini_configured ? (
              <span className="flex items-center gap-1.5 text-sm text-emerald-400"><CheckCircle2 size={16} /> Configured</span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-amber-400"><XCircle size={16} /> Missing</span>
            )
          ) : (
            <span className="text-sm text-slate-500">—</span>
          )}
        </div>

        {errorMsg && <p className="text-sm text-amber-400">{errorMsg}</p>}
        {health && !health.gemini_configured && (
          <p className="text-sm text-slate-400">
            Add <code className="text-accent-blue">GEMINI_API_KEY</code> to <code className="text-accent-blue">backend/.env</code> and
            restart the backend to enable AI generation. You can still create diagrams manually via the Mermaid code editor.
          </p>
        )}
      </div>

      <div className="glass-card p-6 space-y-2 text-sm text-slate-400">
        <p className="font-medium text-slate-200">About</p>
        <p>UML Diagram Generator — converts natural-language requirements into Mermaid UML diagrams using Google Gemini, rendered client-side with Mermaid.js.</p>
      </div>
    </div>
  )
}
