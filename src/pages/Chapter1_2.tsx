import { Suspense, lazy, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { XPContext } from '../components/Layout'

const Scene_ArtStudio = lazy(() => import('../components/Scene_ArtStudio'))

const COLORS = ['#e8eeff', '#ff2d78', '#97CE4C', '#00f0ff', '#FFD700', '#a855f7', '#ff8a65', '#3b82f6']
const BRUSH_SIZES = [3, 6, 10, 16]

const EXAMPLE_TAGLINES = [
  '💡 Wear Smart, Stay Safe',
  '🎒 Your Bag That Thinks',
  '💪 Power on Your Wrist',
]

function StepBadge({ step, label }: { step: number; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface-soft/80 px-4 py-1.5 shadow-sm">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
        {step}
      </span>
      <span className="text-xs font-bold uppercase tracking-wider text-text-mid">{label}</span>
      <span className="h-6 w-[1px] bg-border-soft" />
    </div>
  )
}

export default function Chapter1_2() {
  const { addXP } = useContext(XPContext)
  const r = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState(COLORS[1]) // Start with a bright color
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1])
  const [hasDrawn, setHasDrawn] = useState(false)
  const [brandName, setBrandName] = useState(() => localStorage.getItem('sw_brand_name') || '')
  const [tagline, setTagline] = useState(() => localStorage.getItem('sw_tagline') || '')
  
  // MS Paint Upgrade States
  const [tool, setTool] = useState<'pencil'|'line'|'rect'|'circle'|'eraser'>('pencil')
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => { addXP(10, 'ch1_2_visit') }, [addXP])

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(dataUrl)
    // Keep last 20 actions
    if (newHistory.length > 20) newHistory.shift()
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    localStorage.setItem('sw_drawing', dataUrl)
  }, [history, historyIndex])

  const undo = () => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    const img = new Image()
    img.src = history[newIndex]
    img.onload = () => {
      const ctx = getCtx()
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.drawImage(img, 0, 0)
        setHistoryIndex(newIndex)
        localStorage.setItem('sw_drawing', history[newIndex])
      }
    }
  }

  const redo = () => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    const img = new Image()
    img.src = history[newIndex]
    img.onload = () => {
      const ctx = getCtx()
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.drawImage(img, 0, 0)
        setHistoryIndex(newIndex)
        localStorage.setItem('sw_drawing', history[newIndex])
      }
    }
  }

  const downloadSketch = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${brandName || 'my-invention'}-sketch.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext('2d')
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth
    canvas.height = 420
    const ctx = canvas.getContext('2d')
    if (ctx) { 
      ctx.fillStyle = '#0a0e27'
      ctx.fillRect(0, 0, canvas.width, canvas.height) 
    }
    const saved = localStorage.getItem('sw_drawing')
    if (saved) {
      const img = new Image()
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
        setHistory([saved])
        setHistoryIndex(0)
      }
      img.src = saved
      setHasDrawn(true)
    } else {
      // Initial empty state
      const initial = canvas.toDataURL()
      setHistory([initial])
      setHistoryIndex(0)
    }
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) return { x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width), y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height) }
    return { x: e.nativeEvent.offsetX * (canvas.width / rect.width), y: e.nativeEvent.offsetY * (canvas.height / rect.height) }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => { 
    setIsDrawing(true)
    setHasDrawn(true)
    const pos = getPos(e)
    setStartPos(pos)
    const ctx = getCtx()
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const ctx = getCtx()
    if (!ctx) return
    const pos = getPos(e)
    
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = tool === 'eraser' ? '#0a0e27' : color
    
    if (tool !== 'eraser') {
      ctx.shadowColor = color
      ctx.shadowBlur = tool === 'pencil' ? 8 : 0
    } else {
      ctx.shadowBlur = 0
    }

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    } else {
      // Shape Preview: Restore last state before drawing shape preview
      const img = new Image()
      img.src = history[historyIndex]
      // Note: In a high-perf version we'd use a buffer canvas, 
      // but for this lab, image restoration per frame is acceptable for kids.
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      ctx.drawImage(img, 0, 0)
      
      ctx.beginPath()
      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y)
        ctx.lineTo(pos.x, pos.y)
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y)
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2))
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
      }
      ctx.stroke()
    }
  }

  const stopDraw = () => { 
    if (!isDrawing) return
    setIsDrawing(false)
    const ctx = getCtx()
    if (ctx) ctx.shadowBlur = 0
    saveToHistory()
  }
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) { 
      ctx.fillStyle = '#0a0e27'
      ctx.fillRect(0, 0, canvas.width, canvas.height) 
    }
    localStorage.removeItem('sw_drawing')
    setHasDrawn(false)
    saveToHistory()
  }
  
  const saveDesign = () => { if (hasDrawn && brandName) addXP(40, 'design_saved') }
  const previewReady = Boolean(brandName && (tagline || hasDrawn))

  const progressChecks = [
    Boolean(brandName),
    Boolean(tagline),
    hasDrawn,
    previewReady,
  ]

  return (
    <div className="activity-centre">
      <Suspense fallback={null}>
        <Scene_ArtStudio />
      </Suspense>

      {/* Hero Section */}
      <section className="activity-hero">
        <div className="activity-hero-content">
          <div className="activity-hero-text">
            <motion.div initial={r ? undefined : { opacity: 0, x: -30 }} animate={r ? undefined : { opacity: 1, x: 0 }} transition={r ? undefined : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="activity-hero-badge">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse shadow-lg shadow-secondary/40" />
                <span className="text-xs font-black uppercase tracking-[0.28em] text-text-mid">Module 1 · Chapter 2</span>
              </div>
              <h1 className="activity-hero-title">
                Wearable<br />
                <span className="rainbow-text">Design Lab</span> 🎨
              </h1>
              
              <p className="activity-hero-desc mt-8">
                Students turn the product idea into something visual: brand name, tagline, sketch, and a clearer product identity.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="activity-chip-info">🏷️ Brand it</span>
                <span className="activity-chip-info">✍️ Sketch it</span>
                <span className="activity-chip-info">👁️ Preview it</span>
              </div>

              <div className="flex flex-col items-center gap-4 mt-10 sm:flex-row">
                <button className="btn-primary text-lg px-10 py-4" onClick={saveDesign}>💾 Save My Design</button>
                <a href="#brand-name" className="btn-secondary px-8 py-4 text-base">Start Lab ↓</a>
              </div>
            </motion.div>
          </div>

          <motion.div className="activity-hero-aside"
            initial={r ? undefined : { opacity: 0, x: 30, scale: 0.95 }}
            animate={r ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={r ? undefined : { duration: 0.7, delay: 0.2 }}>
            <img 
              src="/images/ch1_2_design_1776241826488.png" 
              alt="Design Lab Glowing Tablet" 
              className="mx-auto w-full max-w-sm rounded-[32px] shadow-2xl object-cover transform transition-transform hover:scale-105"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="activity-content">
        <div className="activity-grid">
          <div className="activity-main">
            
            {/* Goal Overview */}
            <motion.section className="activity-card activity-card-accent"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-white/60">Chapter Goal</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-white md:text-4xl">Make the invention look real, not random</h2>
                <p className="mt-3 text-base font-medium text-white/70 max-w-2xl mx-auto">
                  This chapter works best when students treat the wearable like a real product on a shelf: it needs a name, a line, and a recognizable look.
                </p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-4 w-full">
                {['Brand name', 'Tagline', 'Shape and style', 'Final sketch'].map((item, i) => (
                  <motion.div key={item}
                    initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="rounded-[18px] border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-semibold text-white/90 backdrop-blur-sm">
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Step 1: Brand Name */}
            <motion.section className="activity-card" id="brand-name"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <StepBadge step={1} label="Name the Brand" />
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">What is your product called?</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">
                  A good name makes the wearable sound like a real product students would be excited to show.
                </p>
                <div className="mt-8 max-w-2xl mx-auto">
                  <input type="text" className="w-full rounded-[20px] border-2 border-primary/20 bg-surface-muted/50 px-6 py-4 text-center font-[Fredoka] text-2xl font-bold text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all hover:bg-white focus:border-primary focus:bg-white focus:outline-none" 
                    placeholder="Example: SmartGuard..."
                    value={brandName} onChange={(e) => { setBrandName(e.target.value); localStorage.setItem('sw_brand_name', e.target.value) }} />
                </div>
              </div>
            </motion.section>

            {/* Step 2: Tagline */}
            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center w-full flex flex-col items-center">
                <StepBadge step={2} label="Create the Tagline" />
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Write a catchy slogan</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">
                    This should sound like a line from an ad: short, catchy, and easy to say.
                </p>
              </div>
                <div className="mt-8 max-w-2xl mx-auto">
                  <input type="text" className="w-full rounded-[16px] border-2 border-border-soft bg-surface-muted/50 px-5 py-3 text-center text-lg font-medium text-text-dark shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all hover:bg-white focus:border-primary/40 focus:bg-white focus:outline-none" 
                    placeholder="A catchy slogan for your product..."
                    value={tagline} onChange={(e) => { setTagline(e.target.value); localStorage.setItem('sw_tagline', e.target.value) }} />
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {EXAMPLE_TAGLINES.map((line) => (
                      <button key={line} className="btn-secondary px-4 py-2 text-xs" onClick={() => { setTagline(line); localStorage.setItem('sw_tagline', line) }}>
                        {line}
                      </button>
                    ))}
                  </div>
                </div>
            </motion.section>

            {/* Step 3: Sketch Station */}
            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <StepBadge step={3} label="Build the Sketch Station" />
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Draw your invention</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">
                  Let students experiment with color, shape, and features.
                </p>
              </div>

              <div className="mt-8 mx-auto w-full max-w-5xl overflow-hidden rounded-[22px] border border-primary/20 bg-white/75 shadow-[6px_6px_16px_rgba(108,92,231,0.06),-3px_-3px_10px_rgba(255,255,255,0.85),inset_0_2px_3px_rgba(255,255,255,0.7)]">
                {/* Sketch Prompts - Top Bar */}
                <div className="border-b border-primary/[0.06] bg-surface-soft/40 px-5 py-4">
                  <div className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-primary/40 text-center mb-3">Sketch Prompts</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['What shape does the device have?', 'Where is the button or sensor?', 'What colors match the mission?', 'How will the logo appear on it?'].map((prompt) => (
                      <div key={prompt} className="rounded-full border border-white/50 bg-white/60 px-3 py-1 text-xs font-semibold text-text-mid">{prompt}</div>
                    ))}
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap justify-center items-center gap-4 border-b border-primary/[0.06] bg-surface-soft/50 px-4 py-4">
                  {/* Tool Selection */}
                  <div className="flex bg-white/40 p-1 rounded-xl border border-primary/10">
                    {[
                      { id: 'pencil', icon: '✏️', label: 'Pencil' },
                      { id: 'line', icon: '📏', label: 'Line' },
                      { id: 'rect', icon: '⬜', label: 'Square' },
                      { id: 'circle', icon: '⭕', label: 'Circle' },
                      { id: 'eraser', icon: '🧹', label: 'Eraser' },
                    ].map((t) => (
                      <button 
                        key={t.id} 
                        title={t.label}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${tool === t.id ? 'bg-primary text-white shadow-lg scale-105' : 'text-text-mid hover:bg-primary/10'}`}
                        onClick={() => setTool(t.id as any)}
                      >
                        <span className="text-lg">{t.icon}</span>
                      </button>
                    ))}
                  </div>

                  <div className="h-8 w-px bg-primary/[0.08]" />

                  {/* Color Palette */}
                  <div className="flex gap-2">
                    {COLORS.map((swatch) => (
                      <button key={swatch} className={`h-7 w-7 rounded-full border-2 transition-transform ${color === swatch && tool !== 'eraser' ? 'border-primary ring-2 ring-primary/20 scale-125 z-10' : 'border-white/80 shadow-sm hover:scale-110'}`} style={{ backgroundColor: swatch }}
                        onClick={() => { setColor(swatch); if (tool === 'eraser') setTool('pencil') }} />
                    ))}
                  </div>

                  <div className="h-8 w-px bg-primary/[0.08]" />

                  {/* Brush Sizes */}
                  <div className="flex gap-1">
                    {BRUSH_SIZES.map((size) => (
                      <button key={size} className={`flex items-center justify-center h-8 px-2 rounded-md text-[0.65rem] font-black transition-all ${brushSize === size ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-mid hover:bg-surface-muted text-opacity-60'}`} onClick={() => setBrushSize(size)}>
                        {size}px
                      </button>
                    ))}
                  </div>

                  <div className="h-8 w-px bg-primary/[0.08]" />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button 
                      disabled={historyIndex <= 0}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 border border-primary/10 text-text-mid transition-all hover:bg-primary/10 disabled:opacity-30 disabled:grayscale"
                      onClick={undo} title="Undo"
                    >
                      ↩️
                    </button>
                    <button 
                      disabled={historyIndex >= history.length - 1}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 border border-primary/10 text-text-mid transition-all hover:bg-primary/10 disabled:opacity-30 disabled:grayscale"
                      onClick={redo} title="Redo"
                    >
                      ↪️
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 border border-primary/10 text-text-mid transition-all hover:bg-accent-red/10 hover:text-accent-red" onClick={clearCanvas} title="Clear All">🗑️</button>
                    <button className="flex h-10 px-4 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95" onClick={downloadSketch}>💾 Download</button>
                  </div>
                </div>

                {/* Canvas Box */}
                <div className="relative bg-void w-full cursor-crosshair">
                  <canvas ref={canvasRef} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} className="w-full" style={{ height: '420px', touchAction: 'none' }} />
                </div>

                {/* Real-Time Preview Strip */}
                {brandName && (
                  <div className="border-t border-primary/10 bg-gradient-to-r from-primary/[0.04] to-secondary/[0.04] px-6 py-5 text-center">
                    <div className="text-xs font-black uppercase tracking-[0.22em] text-primary/40">Brand Preview</div>
                    <div className="mt-2 text-3xl font-[Fredoka] font-bold text-primary">{brandName}</div>
                    {tagline && <div className="mt-1 text-base italic text-text-mid">"{tagline}"</div>}
                  </div>
                )}
              </div>
            </motion.section>

            {/* Design Preview (Former Sidebar) */}
            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">Final Review</div>
                <h3 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark">{brandName || 'Your Brand Name'}</h3>
              </div>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div className="activity-card-nested">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/35">Tagline</div>
                  <p className="mt-3 text-base font-medium leading-relaxed text-text-mid">{tagline || 'Write a short, exciting product line.'}</p>
                </div>
                <div className="activity-card-nested">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/35">Sketch Status</div>
                  <p className="mt-3 text-base font-medium leading-relaxed text-text-mid">{hasDrawn ? '✅ The wearable sketch is ready to present.' : 'Draw the product shape, button, and logo placement.'}</p>
                </div>
                <div className="sm:col-span-2 activity-card-nested activity-card-nested-accent text-center">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/40">Presentation Tip</div>
                  <p className="mt-3 font-[Fredoka] text-2xl font-bold leading-relaxed text-text-dark">Show the sketch while saying the brand name and tagline together.</p>
                </div>
              </div>
            </motion.section>

            {/* Finish Section */}
            <motion.section className="activity-card text-center"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/40">Finish</div>
              <h3 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark">Save the design and move to the pitch chapter</h3>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button className="btn-primary text-lg px-10 py-4" onClick={saveDesign}>💾 Save My Design</button>
                <Link to="/2-1" className="no-underline">
                  <button className="btn-secondary px-8 py-4 text-base">Go To Startup Pitch →</button>
                </Link>
              </div>
              {hasDrawn && brandName && (
                <p className="mt-4 text-sm font-semibold text-primary">+40 XP when the design is saved.</p>
              )}
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  )
}
