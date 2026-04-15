import { useEffect, useState, useCallback } from 'react'

const MAX_XP = 500

export function useXP() {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('smart_wearable_xp') || '0'))

  const addXP = useCallback((amount: number, key: string) => {
    if (localStorage.getItem('xp_' + key)) return false
    localStorage.setItem('xp_' + key, 'true')
    setXp(prev => {
      const next = prev + amount
      localStorage.setItem('smart_wearable_xp', String(next))
      return next
    })
    return true
  }, [])

  const percentage = Math.min((xp / MAX_XP) * 100, 100)

  return { xp, addXP, percentage }
}

export default function XPCounter({ xp }: { xp: number }) {
  const [popup, setPopup] = useState<{ amount: number; id: number } | null>(null)
  const [prevXp, setPrevXp] = useState(xp)

  useEffect(() => {
    if (xp > prevXp) {
      const diff = xp - prevXp
      setPopup({ amount: diff, id: Date.now() })
      setTimeout(() => setPopup(null), 2500)
    }
    setPrevXp(xp)
  }, [xp, prevXp])

  return (
    <>
      <div className="fixed top-4 right-4 z-50 glass-card px-4 py-2.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sunshine to-coral flex items-center justify-center text-white font-bold text-base shadow-md">
          ⭐
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Your XP</div>
          <div className="text-xl font-bold text-sunshine font-[Fredoka]">{xp}</div>
        </div>
      </div>

      {popup && (
        <div
          key={popup.id}
          className="fixed top-20 right-4 z-[60] bg-sunshine/20 border-2 border-sunshine/40 text-sunshine font-[Fredoka] font-bold px-6 py-3 rounded-2xl backdrop-blur-md"
          style={{ animation: 'slideUp 0.5s ease-out, fadeOut 0.5s 1.5s ease-out forwards' }}
        >
          +{popup.amount} XP! ⭐
        </div>
      )}
    </>
  )
}
