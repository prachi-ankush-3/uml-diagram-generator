import { PlayCircle } from 'lucide-react'

export default function MermaidEditor({ code, onChange, onRender }) {
  return (
    <div className="flex flex-col h-full gap-3">
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="input-field flex-1 min-h-[360px] font-mono text-sm leading-relaxed resize-none"
        placeholder="classDiagram
class User {
  +int id
  +String name
  +login()
}"
      />
      <button onClick={onRender} className="btn-primary self-end !py-2 !px-4 text-sm">
        <PlayCircle size={16} /> Render Diagram
      </button>
    </div>
  )
}
