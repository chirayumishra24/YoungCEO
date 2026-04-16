import { useEffect, useState, useCallback } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'

/* ─── XP hook (canonical source: XPCounter.tsx) ─── */
function useXPLocal() {
  const MAX_XP = 500
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('smart_wearable_xp') || '0'))
  const addXP = useCallback((amount: number, key: string) => {
    if (localStorage.getItem('xp_' + key)) return false
    localStorage.setItem('xp_' + key, 'true')
    setXp(prev => { const next = prev + amount; localStorage.setItem('smart_wearable_xp', String(next)); return next })
    return true
  }, [])
  return { xp, addXP, percentage: Math.min((xp / MAX_XP) * 100, 100) }
}

import { createContext } from 'react'
export const XPContext = createContext<ReturnType<typeof useXPLocal>>({ xp: 0, addXP: () => false, percentage: 0 })


/* ─── Level logic ─── */
const levelInfo = (xp: number) => {
  if (xp >= 400) return { title: 'Super CEO', emoji: '🏆', gradient: 'from-amber-400 to-orange-500' }
  if (xp >= 250) return { title: 'CEO', emoji: '👔', gradient: 'from-primary to-primary-dark' }
  if (xp >= 100) return { title: 'Junior CEO', emoji: '📈', gradient: 'from-secondary to-accent-blue' }
  return { title: 'Intern', emoji: '🌱', gradient: 'from-accent-green to-secondary' }
}

/* ─── XP Popup ─── */
function XPPopup({ xp }: { xp: number }) {
  const [popup, setPopup] = useState<{ amount: number; id: number } | null>(null)
  const [prevXp, setPrevXp] = useState(xp)
  const r = useReducedMotion()
  useEffect(() => {
    if (xp > prevXp) { setPopup({ amount: xp - prevXp, id: Date.now() }); setTimeout(() => setPopup(null), 2500) }
    setPrevXp(xp)
  }, [xp, prevXp])
  if (!popup) return null
  return (
    <motion.div key={popup.id}
      initial={r ? undefined : { opacity: 0, y: 12 }} animate={r ? undefined : { opacity: 1, y: 0 }} exit={r ? undefined : { opacity: 0, y: -8 }}
      className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full border border-primary/15 bg-white/95 px-6 py-3 font-[Fredoka] text-base font-bold text-primary shadow-xl shadow-primary/10 backdrop-blur-xl">
      +{popup.amount} XP ⭐
    </motion.div>
  )
}

/* ─── Scroll-to-top FAB ─── */
function ScrollToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-lg shadow-lg shadow-primary/30 hover:scale-110 transition-transform cursor-pointer border-2 border-white/30"
          aria-label="Scroll to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function Layout() {
  const xpData = useXPLocal()
  const location = useLocation()
  const level = levelInfo(xpData.xp)

  return (
    <XPContext.Provider value={xpData}>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        {/* ─── Floating Navbar ─── */}
        <div className="sticky top-4 z-50 px-5 sm:px-8 flex justify-center w-full">
          <nav className="w-full max-w-6xl rounded-2xl border border-white/50 bg-white/65 backdrop-blur-2xl shadow-[0_6px_32px_rgba(108,92,231,0.07),0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between py-4 px-6 sm:px-8">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-3.5 no-underline shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-primary-dark text-xl text-white shadow-lg shadow-primary/25">⌚</div>
                <div>
                  <div className="font-[Fredoka] text-base font-bold text-text-dark leading-tight">Young CEO Challenge</div>
                  <div className="text-[0.6rem] font-black uppercase tracking-[0.24em] text-primary/55 mt-0.5">Wearable Studio</div>
                </div>
              </Link>

              {/* XP Area */}
              <div className="flex items-center gap-2.5">
                <div className={`hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-br ${level.gradient} py-1.5 px-4 shadow-sm`}>
                  <span className="text-sm leading-none">{level.emoji}</span>
                  <span className="font-[Fredoka] text-[0.75rem] font-bold text-white tracking-wide leading-none">{level.title}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-full py-1.5 px-4 border border-border-soft/20 shadow-sm">
                  <span className="text-base leading-none">⭐</span>
                  <span className="font-[Fredoka] text-base font-black text-text-dark leading-none">{xpData.xp}</span>
                  <span className="text-[0.6rem] font-black uppercase tracking-wider text-text-light leading-none pt-0.5">XP</span>
                </div>
              </div>
            </div>

            {/* Thin progress edge */}
            <div className="h-[2px] bg-transparent overflow-hidden rounded-b-2xl">
              <motion.div className="h-full bg-gradient-to-r from-primary via-secondary to-accent-green opacity-70" initial={{ width: 0 }} animate={{ width: `${xpData.percentage}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </nav>
        </div>

        <XPPopup xp={xpData.xp} />
        <ScrollToTop />

        <main className="relative z-10 w-full flex-1" key={location.pathname}><Outlet /></main>

        <footer className="relative z-10 border-t border-white/40 bg-white/50 py-8 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8 flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <p className="font-medium text-text-mid">SkilliZee Young CEO Challenge · Smart Wearable Device Studio</p>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-text-light">Invent · Design · Pitch</p>
          </div>
        </footer>
      </div>
    </XPContext.Provider>
  )
}
