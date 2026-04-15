import { motion } from 'framer-motion'

interface AchievementBadgeProps {
  emoji: string
  name: string
  unlocked?: boolean
  delay?: number
}

export default function AchievementBadge({ emoji, name, unlocked = true, delay = 0 }: AchievementBadgeProps) {
  return (
    <motion.div
      className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'}`}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={unlocked ? { y: -4, scale: 1.05 } : undefined}
    >
      <div className={`achievement-badge-icon ${unlocked ? 'unlocked' : ''}`}>
        <span className="text-2xl">{emoji}</span>
      </div>
      <span className={`achievement-badge-label ${unlocked ? 'unlocked' : ''}`}>{name}</span>
      {unlocked && <div className="achievement-badge-shine" />}
    </motion.div>
  )
}
