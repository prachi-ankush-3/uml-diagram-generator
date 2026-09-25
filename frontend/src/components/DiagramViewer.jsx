import { useEffect, useRef, useState, useCallback } from 'react'
import mermaid from 'mermaid'
import jsPDF from 'jspdf'
import {
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Download,
  AlertTriangle, FileImage, FileText, FileDown,
} from 'lucide-react'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
  themeVariables: {
    background: '#0b0e17',
    primaryColor: '#1f2536',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#5b8cff',
    lineColor: '#5b8cff',
    secondaryColor: '#171c29',
    tertiaryColor: '#11151f',
  },
})

let renderCounter = 0

export default function DiagramViewer({ mermaidCode, projectName = 'diagram', diagramType = 'diagram' }) {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [svgMarkup, setSvgMarkup] = useState('')
  const [error, setError] = useState('')
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)

  const renderDiagram = useCallback(async (code) => {
    if (!code || !code.trim()) {
      setSvgMarkup('')
      setError('')
      return
    }
    try {
      renderCounter += 1
      const id = `mermaid-render-${renderCounter}`
      const { svg } = await mermaid.render(id, code)
      setSvgMarkup(svg)
      setError('')
    } catch (err) {
      setError(err?.message || 'Generated Mermaid code contains an error. You can edit it manually.')
      setSvgMarkup('')
    }
  }, [])

  useEffect(() => {
    renderDiagram(mermaidCode)
  }, [mermaidCode, renderDiagram])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = svgMarkup
    }
  }, [svgMarkup])

  const zoomIn = () => setZoom((z) => Math.min(z + 0.15, 3))
  const zoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.3))
  const resetZoom = () => setZoom(1)

  const toggleFullscreen = () => {
    const el = wrapperRef.current
    if (!document.fullscreenElement) {
      el?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const baseFilename = () => {
    const safeProject = (projectName || 'project').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const safeType = (diagramType || 'diagram').toLowerCase()
    return `${safeProject || 'project'}-${safeType}-diagram`
  }

  const getSvgElement = () => containerRef.current?.querySelector('svg')

  const downloadSVG = () => {
    const svgEl = getSvgElement()
    if (!svgEl) return
    const serializer = new XMLSerializer()
    let source = serializer.serializeToString(svgEl)
    if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
      source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    triggerDownload(URL.createObjectURL(blob), `${baseFilename()}.svg`)
    setDownloadOpen(false)
  }

  const svgToCanvas = () =>
    new Promise((resolve, reject) => {
      const svgEl = getSvgElement()
      if (!svgEl) return reject(new Error('No diagram to export'))
      const serializer = new XMLSerializer()
      let source = serializer.serializeToString(svgEl)
      if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
        source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      }
      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      const bbox = svgEl.getBoundingClientRect()
      const scale = 2 // higher-res export
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = (bbox.width || 800) * scale
        canvas.height = (bbox.height || 600) * scale
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#0b0e17'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        resolve(canvas)
      }
      img.onerror = reject
      img.src = url
    })

  const downloadPNG = async () => {
    try {
      const canvas = await svgToCanvas()
      canvas.toBlob((blob) => {
        triggerDownload(URL.createObjectURL(blob), `${baseFilename()}.png`)
      })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    setDownloadOpen(false)
  }

  const downloadPDF = async () => {
    try {
      const canvas = await svgToCanvas()
      const imgData = canvas.toDataURL('image/png')
      const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait'
      const pdf = new jsPDF({ orientation, unit: 'px', format: [canvas.width, canvas.height] })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`${baseFilename()}.pdf`)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    setDownloadOpen(false)
  }

  const triggerDownload = (href, filename) => {
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative flex flex-col h-full ${isFullscreen ? 'bg-base-900 p-6' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <button onClick={zoomOut} className="btn-secondary !p-2" title="Zoom out"><ZoomOut size={16} /></button>
          <span className="text-xs text-slate-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={zoomIn} className="btn-secondary !p-2" title="Zoom in"><ZoomIn size={16} /></button>
          <button onClick={resetZoom} className="btn-secondary !p-2" title="Reset zoom"><RotateCcw size={16} /></button>
          <button onClick={toggleFullscreen} className="btn-secondary !p-2" title="Fullscreen">
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setDownloadOpen((o) => !o)}
            disabled={!svgMarkup}
            className="btn-primary !py-2 !px-3 text-sm"
          >
            <Download size={15} /> Download
          </button>
          {downloadOpen && (
            <div className="absolute right-0 mt-2 w-40 glass-card p-1.5 z-30 fade-in">
              <button onClick={downloadPNG} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-white/10 text-left">
                <FileImage size={14} /> PNG
              </button>
              <button onClick={downloadSVG} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-white/10 text-left">
                <FileText size={14} /> SVG
              </button>
              <button onClick={downloadPDF} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-white/10 text-left">
                <FileDown size={14} /> PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-base-800/40 p-6 flex items-center justify-center min-h-[360px]">
        {error && (
          <div className="flex flex-col items-center gap-2 text-center text-amber-400 max-w-md">
            <AlertTriangle size={28} />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!error && !svgMarkup && (
          <p className="text-sm text-slate-500">Your generated diagram will appear here.</p>
        )}
        {!error && svgMarkup && (
          <div
            ref={containerRef}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="transition-transform duration-150"
          />
        )}
      </div>
    </div>
  )
}
