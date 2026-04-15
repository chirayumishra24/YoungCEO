import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const chapters = [
  { path: '/1-1', num: '1.1', title: 'Product Idea', emoji: '🧪', color: 'from-secondary to-accent-green' },
  { path: '/1-2', num: '1.2', title: 'Design Lab', emoji: '🎨', color: 'from-accent-pink to-accent-orange' },
  { path: '/2-1', num: '2.1', title: 'Startup Pitch', emoji: '🎤', color: 'from-accent-orange to-accent-pink' },
  { path: '/2-2', num: '2.2', title: 'Team Roleplay', emoji: '💼', color: 'from-primary to-primary-dark' },
  { path: '/final', num: '★', title: 'Shark Pitch', emoji: '🏆', color: 'from-[#FFD700] to-[#FFA502]' },
]

export default function JourneyTimeline() {
  return (
    <div className="journey-timeline">
      {chapters.map((ch, i) => (
        <div key={ch.path} className="journey-timeline-item">
          {i > 0 && (
            <div className="journey-timeline-connector">
              <motion.div
                className="journey-timeline-connector-fill"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              />
            </div>
          )}
          <Link to={ch.path} className="no-underline">
            <motion.div
              className="journey-timeline-node"
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              whileHover={{ y: -4, scale: 1.08 }}
            >
              <div className={`journey-timeline-icon bg-gradient-to-br ${ch.color}`}>
                <span className="text-xl">{ch.emoji}</span>
              </div>
              <span className="journey-timeline-num">{ch.num}</span>
              <span className="journey-timeline-title">{ch.title}</span>
            </motion.div>
          </Link>
        </div>
      ))}
    </div>
  )
}
