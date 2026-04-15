import { createContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useXP } from './XPCounter'
import { PageContainer, cx } from './StudioPage'

export const XPContext = createContext<ReturnType<typeof useXP>>({ xp: 0, addXP: () => false, percentage: 0 })

// Removed chapter tabs array for simpler navigation

const levelInfo = (xp: number) => {
  if (xp >= 400) return { title: 'Super CEO', emoji: '🏆', color: 'from-amber-400 to-orange-500' }
  if (xp >= 250) return { title: 'CEO', emoji: '👔', color: 'from-primary to-primary-dark' }
  if (xp >= 100) return { title: 'Junior CEO', emoji: '📈', color: 'from-secondary to-accent-blue' }
  return { title: 'Intern', emoji: '🌱', color: 'from-accent-green to-secondary' }
}

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
      className="fixed left-1/2 top-24 z-[60] -translate-x-1/2 rounded-full border border-primary/15 bg-white/95 px-6 py-3 font-[Fredoka] text-base font-bold text-primary shadow-xl shadow-primary/10 backdrop-blur-xl">
      +{popup.amount} XP ⭐
    </motion.div>
  )
}

export default function Layout() {
  const xpData = useXP()
  const location = useLocation()
  const level = levelInfo(xpData.xp)

  return (
    <XPContext.Provider value={xpData}>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        {/* Floating Pill Navbar */}
        <div className="sticky top-4 z-50 px-4 sm:px-6 flex justify-center w-full">
          <nav className="w-full max-w-[80rem] rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-3xl shadow-[0_8px_32px_rgba(108,92,231,0.08),inset_0_2px_4px_rgba(255,255,255,0.9)] transition-all">
            <div className="flex flex-col gap-4 py-3 px-5 md:flex-row md:items-center md:justify-between">
              
              {/* Logo Area */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] text-2xl text-white shadow-lg shadow-[#6C5CE7]/30 hover:scale-105 transition-transform cursor-pointer">⌚</div>
                <div className="flex flex-col justify-center">
                  <div className="font-[Fredoka] text-xl font-bold text-text-dark tracking-tight leading-tight">Young CEO Challenge</div>
                  <div className="text-[0.66rem] font-black uppercase tracking-[0.3em] text-[#6C5CE7]/70 mt-0.5">Wearable Studio</div>
                </div>
              </div>

              {/* XP Area */}
              <div className="flex items-center justify-center gap-3 bg-white/50 p-1.5 rounded-full border border-white/50 shadow-[inset_0_2px_4px_rgba(255,255,255,1)]">
                <div className={`flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-br ${level.color} px-5 text-sm font-bold text-white shadow-md`}>
                  <span className="text-lg">{level.emoji}</span>
                  <span className="font-[Fredoka] tracking-wide">{level.title}</span>
                </div>
                
                <div className="flex items-center gap-3 px-3 pr-5">
                  <div className="hidden sm:block relative h-2.5 w-24 overflow-hidden rounded-full bg-surface-muted border border-black/5 shadow-inner">
                    <motion.div 
                      className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#00CEC9] shadow-[0_0_8px_rgba(108,92,231,0.5)]" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${xpData.percentage}%` }} 
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} 
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl drop-shadow-sm">⭐</span>
                    <span className="font-[Fredoka] text-xl sm:text-2xl font-black text-text-dark tracking-tight">{xpData.xp}</span>
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-light/80">XP</span>
                  </div>
                </div>
              </div>
              
            </div>
            {/* Edge Progress Bar */}
            <div className="h-[2px] bg-transparent overflow-hidden rounded-b-[2rem]">
              <motion.div className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#00CEC9] opacity-80" initial={{ width: 0 }} animate={{ width: `${xpData.percentage}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </nav>
        </div>

        <XPPopup xp={xpData.xp} />

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
