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
        {/* Navbar */}
        <nav className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_4px_16px_rgba(108,92,231,0.04),inset_0_-1px_0_rgba(255,255,255,0.5)]">
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8 flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-center md:gap-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-gradient-to-br from-primary to-primary-dark text-xl text-white shadow-lg shadow-primary/20">⌚</div>
              <div>
                <div className="text-[0.66rem] font-black uppercase tracking-[0.28em] text-primary/50">Wearable Studio</div>
                <div className="font-[Fredoka] text-lg font-bold text-text-dark">Young CEO Challenge</div>
              </div>
            </div>

            {/* Tabs have been removed; navbar is now clean and fully centered */}

            <div className="flex items-center justify-center gap-4 bg-white/40 p-1.5 rounded-full border border-white/50 shadow-[rgba(108,92,231,0.08)_0px_4px_16px,inset_rgba(255,255,255,0.8)_0px_2px_4px]">
              <div className={`flex h-10 items-center gap-2 rounded-full bg-gradient-to-r ${level.color} px-5 text-sm font-bold text-white shadow-lg`}>
                <span className="text-lg">{level.emoji}</span>
                <span className="font-[Fredoka] tracking-wide">{level.title}</span>
              </div>
              
              <div className="flex items-center gap-4 px-4 pr-6">
                <div className="relative h-2.5 w-24 overflow-hidden rounded-full bg-primary/[0.08]">
                  <motion.div 
                    className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#00CEC9] shadow-[0_0_12px_rgba(108,92,231,0.4)]" 
                    initial={{ width: 0 }} 
                    animate={{ width: `${xpData.percentage}%` }} 
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl drop-shadow-sm">⭐</span>
                  <span className="font-[Fredoka] text-2xl font-black text-text-dark tracking-tight">{xpData.xp}</span>
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-text-light/60">XP</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[1.5px] bg-primary/[0.03]">
            <motion.div className="h-full bg-gradient-to-r from-primary via-secondary to-accent-orange" initial={{ width: 0 }} animate={{ width: `${xpData.percentage}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </nav>

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
