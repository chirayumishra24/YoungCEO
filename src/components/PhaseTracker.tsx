import { motion } from 'framer-motion'

interface PhaseTrackerProps {
  steps: { label: string; emoji: string; done: boolean }[]
  activeIndex: number
}

export default function PhaseTracker({ steps, activeIndex }: PhaseTrackerProps) {
  return (
    <div className="phase-tracker">
      {steps.map((step, i) => {
        const isActive = i === activeIndex
        const isDone = step.done
        return (
          <div key={step.label} className="phase-tracker-step">
            {i > 0 && (
              <div className={`phase-tracker-line ${isDone || i <= activeIndex ? 'active' : ''}`}>
                {(isDone || i <= activeIndex) && (
                  <motion.div
                    className="phase-tracker-line-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  />
                )}
              </div>
            )}
            <motion.div
              className={`phase-tracker-dot ${isDone ? 'done' : isActive ? 'active' : ''}`}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: isDone || isActive ? 1 : 0.85, opacity: isDone || isActive ? 1 : 0.5 }}
              transition={{ duration: 0.4 }}
            >
              {isDone ? '✓' : step.emoji}
            </motion.div>
            <span className={`phase-tracker-label ${isDone ? 'done' : isActive ? 'active' : ''}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
