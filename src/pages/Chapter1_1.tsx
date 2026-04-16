import { Suspense, lazy, useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useXP } from '../context/XPContext'
import { DEVICES, IDEA_EXAMPLES } from '../constants'
import { ChapterLayout } from '../components/ChapterLayout'
import { PhaseTracker, ProgressRing } from '../components/UIComponents'
import CircuitDivider from '../components/CircuitDivider'

const Scene_InventorLab = lazy(() => import('../components/Scene_InventorLab'))

const ease = [0.22, 1, 0.36, 1] as const

const missions = [
  { id: 'safety', emoji: '🆘', title: 'Safety Hero', desc: 'Create a wearable that helps a student call for help fast.', studentLine: 'This gadget helps when someone feels unsafe or needs quick help.', gradient: 'from-red-400 to-orange-400', glow: 'shadow-red-300/30', bg: 'bg-red-50' },
  { id: 'lost', emoji: '🎒', title: 'Lost & Found', desc: 'Invent something that helps find a lost bag or school item.', studentLine: 'This gadget helps when a school bag or item goes missing.', gradient: 'from-cyan-400 to-blue-400', glow: 'shadow-cyan-300/30', bg: 'bg-cyan-50' },
  { id: 'focus', emoji: '⏰', title: 'Homework Buddy', desc: 'Build a wearable that reminds students about tasks and routines.', studentLine: 'This gadget helps students remember homework, water, and daily tasks.', gradient: 'from-green-400 to-emerald-400', glow: 'shadow-green-300/30', bg: 'bg-green-50' },
  { id: 'health', emoji: '🏃', title: 'Healthy Habits', desc: 'Design a wearable that helps students move, rest, or stay active.', studentLine: 'This gadget helps students stay active, healthy, and energized.', gradient: 'from-purple-400 to-violet-400', glow: 'shadow-purple-300/30', bg: 'bg-purple-50' },
]

const priceOptions = [
  { id: 'easy', label: 'Pocket Friendly', price: '₹499', desc: 'Simple build, easy for families to try', gradient: 'from-green-400 to-teal-400', emoji: '🌿' },
  { id: 'smart', label: 'Popular Pick', price: '₹799', desc: 'Balanced price with more cool powers', gradient: 'from-blue-400 to-indigo-400', emoji: '⭐' },
  { id: 'wow', label: 'Super Gadget', price: '₹1199', desc: 'Big wow factor for a premium version', gradient: 'from-orange-400 to-pink-400', emoji: '🚀' },
]

function pickUniqueIndices(count: number, max: number) {
  const chosen = new Set<number>()
  while (chosen.size < count) chosen.add(Math.floor(Math.random() * max))
  return [...chosen]
}

/* ─── step badge ─── */
function StepBadge({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="step-badge-num">{step}</div>
      <span className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">{label}</span>
    </div>
  )
}

/* ─── progress ring ─── */
function ProgressRing({ progress }: { progress: number }) {
  const r = 52, c = 2 * Math.PI * r
  return (
    <div className="relative flex items-center justify-center">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(108,92,231,0.08)" strokeWidth="8" />
        <motion.circle cx="65" cy="65" r={r} fill="none" stroke="url(#progressGrad)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (c * progress) / 100 }}
          transition={{ duration: 0.8, ease }} style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }} />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="50%" stopColor="#00CEC9" />
            <stop offset="100%" stopColor="#FDCB6E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-[Fredoka] text-3xl font-bold text-primary">{Math.round(progress)}%</span>
        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-text-light">Complete</span>
      </div>
    </div>
  )
}

/* ─── confetti burst on mission complete ─── */
function ConfettiBurst() {
  const pieces = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: ['🎉', '⭐', '🚀', '✨', '💎', '🌟'][i % 6],
      x: (Math.random() - 0.5) * 300,
      y: -(Math.random() * 200 + 100),
      rotate: Math.random() * 720 - 360,
      delay: Math.random() * 0.3,
    })), [])
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {pieces.map((p) => (
        <motion.div key={p.id} className="absolute left-1/2 top-1/2 text-2xl"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate, scale: 1.5 }}
          transition={{ duration: 1.4, delay: p.delay, ease: 'easeOut' }}>
          {p.emoji}
        </motion.div>
      ))}
    </div>
  )
}

export default function Chapter1_1() {
  const { addXP } = useContext(XPContext)
  const shouldReduceMotion = useReducedMotion()
  const cardHover = shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }

  const [selectedMission, setSelectedMission] = useState<string | null>(() => localStorage.getItem('sw_selected_mission'))
  const [selectedDevice, setSelectedDevice] = useState<string | null>(() => localStorage.getItem('sw_selected_device'))
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>(() => JSON.parse(localStorage.getItem('sw_selected_ideas') || '[]'))
  const [customIdea, setCustomIdea] = useState(() => localStorage.getItem('sw_custom_idea') || '')
  const [selectedPrice, setSelectedPrice] = useState<string | null>(() => localStorage.getItem('sw_selected_price'))
  const [formData, setFormData] = useState<Record<string, string>>(() => JSON.parse(localStorage.getItem('sw_startup_sheet') || '{}'))

  useEffect(() => { addXP(10, 'ch1_1_visit') }, [addXP])

  const selectedMissionData = missions.find((m) => m.id === selectedMission)
  const selectedDeviceData = DEVICES.find((d) => d.id === selectedDevice)
  const selectedPriceData = priceOptions.find((o) => o.id === selectedPrice)
  const selectedIdeaData = selectedIdeas.map((i) => IDEA_EXAMPLES[i]).filter(Boolean)

  const prototypeName = useMemo(() => {
    if (!selectedMissionData || !selectedDeviceData) return 'Your Hero Gadget'
    return `${selectedMissionData.title.split(' ')[0]} ${selectedDeviceData.name.replace('Smart ', '')}`
  }, [selectedDeviceData, selectedMissionData])

  const progressChecks = [
    Boolean(selectedMission),
    Boolean(selectedDevice),
    selectedIdeas.length >= 2 || customIdea.trim().length > 0,
    Boolean(formData.problem && formData.howItWorks && formData.wow && formData.salesLine && selectedPrice),
  ]
  const progress = (progressChecks.filter(Boolean).length / progressChecks.length) * 100
  const missionComplete = progressChecks[3]

  useEffect(() => { if (missionComplete) addXP(50, 'startup_sheet_done') }, [missionComplete, addXP])

  const persistFormData = (next: Record<string, string>) => { setFormData(next); localStorage.setItem('sw_startup_sheet', JSON.stringify(next)) }
  const updateField = (key: string, value: string) => persistFormData({ ...formData, [key]: value })
  const jumpTo = (id: string) => { setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 160) }

  const handleMissionSelect = (id: string) => { setSelectedMission(id); localStorage.setItem('sw_selected_mission', id); addXP(15, 'mission_selected'); jumpTo('step-device') }
  const handleDeviceSelect = (id: string) => { setSelectedDevice(id); localStorage.setItem('sw_selected_device', id); addXP(20, 'device_selected'); jumpTo('step-powers') }
  const toggleIdea = (index: number) => {
    const next = selectedIdeas.includes(index) ? selectedIdeas.filter((i) => i !== index) : [...selectedIdeas, index]
    setSelectedIdeas(next); localStorage.setItem('sw_selected_ideas', JSON.stringify(next))
    if (next.length >= 2) addXP(20, 'ideas_selected')
  }
  const handlePriceSelect = (id: string) => { setSelectedPrice(id); localStorage.setItem('sw_selected_price', id) }
  const handleCustomIdeaChange = (v: string) => { setCustomIdea(v); localStorage.setItem('sw_custom_idea', v) }

  const generateSurpriseCombo = () => {
    const mission = missions[Math.floor(Math.random() * missions.length)]
    const device = DEVICES[Math.floor(Math.random() * DEVICES.length)]
    const ideaIndexes = pickUniqueIndices(3, IDEA_EXAMPLES.length)
    const price = priceOptions[Math.floor(Math.random() * priceOptions.length)]
    setSelectedMission(mission.id); setSelectedDevice(device.id); setSelectedIdeas(ideaIndexes); setSelectedPrice(price.id); setCustomIdea('')
    localStorage.setItem('sw_selected_mission', mission.id); localStorage.setItem('sw_selected_device', device.id)
    localStorage.setItem('sw_selected_ideas', JSON.stringify(ideaIndexes)); localStorage.setItem('sw_selected_price', price.id); localStorage.setItem('sw_custom_idea', '')
    persistFormData({
      problem: mission.studentLine,
      howItWorks: `Students wear the ${device.name.toLowerCase()} and tap it when they need help.`,
      wow: `It can ${ideaIndexes.map((i) => IDEA_EXAMPLES[i].text.toLowerCase()).join(', ')}.`,
      salesLine: `Meet the ${mission.title.split(' ')[0]} ${device.name.replace('Smart ', '')} - a student gadget that makes school life easier!`,
    })
    addXP(10, 'surprise_combo'); jumpTo('step-console')
  }

  return (
    <ChapterLayout
      scene={<Scene_InventorLab />}
      moduleChapter="Module 1 · Chapter 1"
      title={<>Build Your<br /><span className="rainbow-text">Product Idea</span> 🚀</>}
      desc="Start with a real problem, choose a wearable, add cool powers, and build a mini startup pitch!"
      chips={
        <>
          <span className="activity-chip-info">🎯 Mission-first activity</span>
          <span className="activity-chip-info">🔢 4 simple steps</span>
          <span className="activity-chip-info">📋 Sticky live pitch card</span>
        </>
      }
      heroActions={
        <>
          <button className="btn-primary text-xl px-12 py-5" onClick={generateSurpriseCombo}>⚡ Surprise Combo</button>
          <a href="#mission-board" className="btn-secondary px-8 py-5 text-base">Start Building ↓</a>
        </>
      }
      heroAside={
        <div className="activity-card !p-8 shadow-2xl">
          <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50 text-center mb-6">Mission Meter</div>
          <div className="flex justify-center">
            <ProgressRing progress={progress} />
          </div>
          <div className="mt-8 space-y-3">
            {[
              { done: progressChecks[0], label: 'Pick the student problem', emoji: '🎯' },
              { done: progressChecks[1], label: 'Choose the wearable', emoji: '⌚' },
              { done: progressChecks[2], label: 'Add the powers', emoji: '⚡' },
              { done: progressChecks[3], label: 'Finish the founder card', emoji: '📋' },
            ].map((step) => (
              <div key={step.label} className={`activity-checklist-item ${step.done ? 'done' : ''}`}>
                <div className={`activity-checklist-icon ${step.done ? 'done' : ''}`}>
                  {step.done ? '✓' : step.emoji}
                </div>
                <span className={`text-sm font-bold ${step.done ? 'text-text-dark' : 'text-text-light'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      }
      tracker={
        <PhaseTracker
          activeIndex={progressChecks.findIndex(c => !c)}
          steps={[
            { label: 'Problem', emoji: '🎯', done: progressChecks[0] },
            { label: 'Gadget', emoji: '⌚', done: progressChecks[1] },
            { label: 'Powers', emoji: '⚡', done: progressChecks[2] },
            { label: 'Founder', emoji: '📋', done: progressChecks[3] },
          ]}
        />
      }
    >
      {/* Main Content */}
      <div className="activity-content">
        <div className="activity-grid-sidebar">
          <div className="activity-main">
            {/* Mission Overview */}
            <motion.section className="activity-card activity-card-accent"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.5, ease }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-white/60">Mission Overview</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-white md:text-4xl">A simple structure students can follow 📝</h2>
                <p className="mt-3 text-base font-medium text-white/70 max-w-2xl mx-auto">Keep the room focused with one simple rule: first choose the problem, then choose the gadget, then add powers, then pitch it.</p>
              </div>
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {['1. Pick the student problem 🎯', '2. Choose the wearable body ⌚', '3. Add powers and pitch it 🎤'].map((tip, i) => (
                  <motion.div key={tip}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1, ease }}
                    className="rounded-[22px] border border-white/20 bg-white/10 p-7 text-center text-lg font-semibold text-white backdrop-blur-sm shadow-xl shadow-black/5">
                    {tip}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Step 1 — Mission */}
            <motion.section className="activity-card" id="mission-board"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.5, ease }}>
              <div className="text-center">
                <StepBadge step={1} label="Choose the Problem" />
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Which student needs help? 🤔</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Starting with the problem makes the invention easier to explain and much easier for students to connect with.</p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {missions.map((mission, i) => {
                  const isSelected = selectedMission === mission.id
                  return (
                    <motion.button key={mission.id} whileHover={cardHover} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08, ease }}
                      onClick={() => handleMissionSelect(mission.id)}
                      className={`activity-mission-card ${isSelected ? 'selected' : ''}`}>
                      <div className={`activity-mission-icon bg-gradient-to-br ${mission.gradient} ${mission.glow}`}>
                        <span className="text-3xl">{mission.emoji}</span>
                      </div>
                      <div className="text-center">
                        <h3 className="font-[Fredoka] text-2xl font-bold text-text-dark">{mission.title}</h3>
                        <p className={`mt-2 text-sm font-medium leading-relaxed ${isSelected ? 'text-primary' : 'text-text-mid'}`}>{mission.desc}</p>
                      </div>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-primary/30">
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.section>

            <CircuitDivider />

            {/* Step 2 — Device */}
            <motion.section className="activity-card tilt-card" id="step-device"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.5, ease }}>
              <div className="text-center">
                <StepBadge step={2} label="Pick the Gadget" />
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">What will it look like? ⌚</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Now students choose what the invention will look like in real life.</p>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {DEVICES.map((device, i) => {
                  const isSelected = selectedDevice === device.id
                  return (
                    <motion.button key={device.id} 
                      whileHover={{ y: -8, scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }} 
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} 
                      transition={{ duration: 0.5, delay: i * 0.1, ease }}
                      onClick={() => handleDeviceSelect(device.id)}
                      className={`activity-device-card group relative flex flex-col items-center !p-8 ${isSelected ? 'selected scale-[1.03] ring-4 ring-primary/20' : ''}`}>
                      
                      <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${device.color === 'bubblegum' ? 'from-pink-100 to-rose-100' : device.color === 'sky' ? 'from-cyan-100 to-blue-100' : device.color === 'sunshine' ? 'from-amber-100 to-orange-100' : 'from-purple-100 to-indigo-100'} shadow-inner transform transition-transform group-hover:rotate-6`}>
                        <span className="text-5xl drop-shadow-md">{device.emoji}</span>
                      </div>

                      <div className="text-center">
                        <h3 className="font-[Fredoka] text-xl font-bold text-text-dark">{device.name}</h3>
                        <p className="mt-2 text-sm font-medium text-text-mid leading-relaxed">{device.desc}</p>
                      </div>

                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-lg font-bold shadow-xl shadow-primary/40 border-4 border-white">
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.section>

            <CircuitDivider />

            {/* Step 3 — Powers */}
            <motion.section className="activity-card tilt-card" id="step-powers"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.5, ease }}>
              <div className="text-center">
                <StepBadge step={3} label="Add the Powers" />
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Give it superpowers! ⚡</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Tap at least two ready-made powers or invent your own power-up.</p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {IDEA_EXAMPLES.map((idea, index) => (
                  <motion.button key={idea.text} whileHover={cardHover} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    onClick={() => toggleIdea(index)}
                    className={`idea-chip text-base ${selectedIdeas.includes(index) ? 'selected' : ''}`}>
                    <span className="text-2xl">{idea.emoji}</span>
                    <span>{idea.text}</span>
                  </motion.button>
                ))}
              </div>
              <div className="mt-8 activity-custom-idea">
                <label className="text-sm font-black uppercase tracking-[0.22em] text-primary/50 text-center block">✨ Or invent your own crazy power</label>
                <input type="text" className="fun-input mt-4 text-lg text-center" placeholder="Example: It flashes when the school bus is nearby!" value={customIdea} onChange={(e) => handleCustomIdeaChange(e.target.value)} />
              </div>
            </motion.section>

            <CircuitDivider />

            {/* Step 4 — Founder Card */}
            <motion.section className="activity-card tilt-card" id="step-console"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.5, ease }}>
              <div className="text-center">
                <StepBadge step={4} label="Founder Card" />
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Tell the world about it! 🌍</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Use short prompts, simple language, and one strong line students can say out loud.</p>
              </div>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[
                  { key: 'problem', title: '🎯 Who does it help?', hint: 'Example: It helps students feel safe when walking home.', emoji: '🎯' },
                  { key: 'howItWorks', title: '⚙️ How does it work?', hint: 'Example: When they tap the SOS button, it sends an alert to parents.', emoji: '⚙️' },
                  { key: 'wow', title: '✨ What is the wow feature?', hint: 'Example: It glows in the dark and can track a lost bag.', emoji: '✨' },
                  { key: 'salesLine', title: '🎤 Sell it in one line', hint: 'Example: The Smart Bag that protects your school day!', emoji: '🎤' },
                ].map((field, i) => (
                  <motion.div key={field.key}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08, ease }}
                    className="activity-form-card">
                    <div className="text-sm font-black uppercase tracking-[0.22em] text-primary/50 text-center">{field.title}</div>
                    <textarea className="fun-input mt-4 min-h-[128px] text-base" placeholder={field.hint} rows={4} value={formData[field.key] || ''} onChange={(e) => updateField(field.key, e.target.value)} />
                  </motion.div>
                ))}
              </div>

              {/* Price picker */}
              <div className="mt-10 text-center">
                <div className="text-sm font-black uppercase tracking-[0.22em] text-primary/50">💰 Pick a price style</div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {priceOptions.map((option, i) => {
                    const isSelected = selectedPrice === option.id
                    return (
                      <motion.button key={option.id} whileHover={cardHover} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08, ease }}
                        onClick={() => handlePriceSelect(option.id)}
                        className={`activity-price-card ${isSelected ? 'selected' : ''}`}>
                        <div className="text-3xl mb-2">{option.emoji}</div>
                        <span className={`inline-flex rounded-full bg-gradient-to-r ${option.gradient} px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-white`}>{option.label}</span>
                        <div className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark">{option.price}</div>
                        <p className={`mt-2 text-sm font-medium leading-relaxed ${isSelected ? 'text-primary' : 'text-text-mid'}`}>{option.desc}</p>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.section>

            {/* Mission Complete */}
            <AnimatePresence>
              {missionComplete && (
                <motion.section className="activity-card activity-card-success relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease }}>
                  <ConfettiBurst />
                  <div className="text-center relative z-10">
                    <div className="text-5xl mb-4">🎉</div>
                    <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-amber-600/60">Mission Complete!</div>
                    <h3 className="mt-3 font-[Fredoka] text-4xl font-bold text-text-dark">The prototype is ready for the design lab!</h3>
                    <p className="mt-4 max-w-2xl mx-auto text-lg font-medium leading-relaxed text-text-mid">
                      Students now have the problem, device, powers, price, and one-line pitch. Next, they can turn the invention into a visual brand.
                    </p>
                    <div className="mt-8">
                      <Link to="/1-2" className="no-underline">
                        <button className="btn-primary px-10 py-4 text-lg">Go To Design Lab 🎨 →</button>
                      </Link>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Sticky Sidebar — Live Pitch Card */}
          <div className="activity-sidebar">
            <div className="activity-sidebar-sticky">
              <motion.div className="activity-pitch-card"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2, ease }}>
                <div className="text-center">
                  <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">🎤 Live Pitch Card</div>
                  <h3 className="mt-3 font-[Fredoka] text-2xl font-bold text-text-dark">{prototypeName}</h3>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { label: '🎯 Mission', value: selectedMissionData?.title || 'Choose the student problem first.' },
                    { label: '⌚ Prototype', value: selectedDeviceData?.name || 'Pick the wearable body.' },
                    { label: '⚡ Power List', value: selectedIdeaData.length > 0 ? selectedIdeaData.map((i) => i.text).join(' • ') : customIdea || 'Add two useful powers.' },
                    { label: '💰 Price', value: selectedPriceData?.price || 'Choose the price style.' },
                  ].map((item) => (
                    <div key={item.label} className="activity-pitch-row">
                      <div className="text-xs font-bold text-primary/40">{item.label}</div>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-text-mid">{item.value}</p>
                    </div>
                  ))}
                  <div className="activity-pitch-row highlight">
                    <div className="text-xs font-bold text-primary/50">🎤 One-Line Pitch</div>
                    <p className="mt-1 font-[Fredoka] text-lg font-bold leading-relaxed text-text-dark">{formData.salesLine || 'Write the line students can proudly say out loud.'}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ChapterLayout>
  )
}
