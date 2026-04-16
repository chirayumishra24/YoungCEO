import { Suspense, lazy, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useXP } from '../context/XPContext'
import { ChapterLayout } from '../components/ChapterLayout'
import { SKILLS } from '../constants'
import Confetti from 'react-confetti'
import JourneyTimeline from '../components/JourneyTimeline'
import AchievementBadge from '../components/AchievementBadge'
import CircuitDivider from '../components/CircuitDivider'

const Scene_TrophyRoom = lazy(() => import('../components/Scene_TrophyRoom'))

const presentationItems = [
  { emoji: '🏷️', text: 'Introduce the brand and wearable device' },
  { emoji: '⚙️', text: 'Explain the features and uses' },
  { emoji: '💰', text: 'Share the price and selling idea' },
  { emoji: '💡', text: 'Tell why the invention is innovative' },
]

export default function Final() {
  const { addXP, xp } = useXP()
  const [showConfetti, setShowConfetti] = useState(false)
  const r = useReducedMotion()

  useEffect(() => { addXP(20, 'final_visit') }, [addXP])

  const triggerCelebration = () => {
    addXP(50, 'shark_pitch_done')
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
  }

  const level = xp >= 400
    ? { title: 'Super CEO', emoji: '🏆', color: 'bg-accent-orange', glow: 'shadow-accent-orange/40', bar: 'from-accent-yellow to-accent-orange' }
    : xp >= 250
      ? { title: 'CEO', emoji: '👔', color: 'bg-primary', glow: 'shadow-primary/40', bar: 'from-secondary to-primary' }
      : xp >= 100
        ? { title: 'Junior CEO', emoji: '📈', color: 'bg-secondary', glow: 'shadow-secondary/40', bar: 'from-surface-muted to-secondary' }
        : { title: 'Intern', emoji: '🌱', color: 'bg-surface-muted', glow: 'shadow-surface-muted/40', bar: 'from-border-soft to-surface-muted' }

  return (
    <>
      {/* Confetti Overlay */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-[100]">
          <Confetti recycle={false} numberOfPieces={300} colors={['#A259FF', '#1E1E1E', '#F24E1E', '#FFB800', '#000000']} />
        </div>
      )}

      <ChapterLayout
        scene={<Scene_TrophyRoom />}
        moduleChapter="Final Presentation"
        title={<>Shark Pitch<br /><span className="rainbow-text">Competition</span> 🎤</>}
        desc="The course ends with one strong stage, a clear presentation checklist, and a final celebration moment."
        chips={
          <>
            <span className="activity-chip-info">Final showcase</span>
            <span className="activity-chip-info">XP celebration</span>
            <span className="activity-chip-info">CEO level reveal</span>
          </>
        }
        heroBottom={
          <div className="mt-8 p-6 rounded-[24px] bg-white border border-primary/10 shadow-[8px_8px_0px_#A259FF] transform transition-transform hover:-translate-y-1 block w-full">
            <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-text-mid mb-3">Your CEO Level</div>
            <div className="inline-flex rounded-full bg-surface-soft px-4 py-2 text-base font-bold text-text-dark border border-border-soft mb-4">
              {level.emoji} {level.title}
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-surface-muted border border-border-soft/50 shadow-inner">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${level.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((xp / 500) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-2 text-sm font-bold text-primary">{xp} <span className="text-text-mid font-medium">/ 500 XP</span></div>
          </div>
        }
        heroAside={
          <img
            src="/images/final_trophy_1776241882840.png"
            alt="Golden Trophy with Confetti"
            className="mx-auto w-full max-w-sm rounded-[32px] shadow-2xl object-cover transform transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_rgba(108,92,231,0.15)]"
          />
        }
      >
        {/* Journey Timeline */}
        <div className="activity-content" style={{ marginBottom: '1rem' }}>
          <motion.section className="activity-card tilt-card"
            initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
            <div className="text-center">
              <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">Your Journey</div>
              <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">From Idea to Stage</h2>
              <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Every chapter brought you closer to the final pitch.</p>
            </div>
            <div className="mt-8">
              <JourneyTimeline />
            </div>
          </motion.section>
        </div>

        {/* Main Content */}
        <div className="activity-content">
          <div className="activity-grid">
            <div className="activity-main">

              {/* The Pitch Setup */}
              <motion.section className="activity-card activity-card-accent text-center"
                initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-white/60">Final Stage</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-white md:text-4xl">A short, proud pitch</h2>
                <p className="mt-3 text-base font-medium text-white/70 max-w-2xl mx-auto">
                  This final page should feel celebratory, but the structure still helps students know exactly what to present.
                </p>
                <div className="mt-8">
                  <button className="btn-secondary px-8 py-4 text-base bg-white text-primary border-white hover:bg-surface-soft" onClick={triggerCelebration}>
                    🎆 I Presented My Pitch
                  </button>
                </div>
              </motion.section>

              {/* Checklist */}
              <motion.section className="activity-card"
                initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
                <div className="text-center">
                  <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">Presentation Checklist</div>
                  <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Four things to cover</h2>
                  <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto mb-8">
                    Keep the final talk anchored to the same content they built through the course.
                  </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  {presentationItems.map((item, i) => (
                    <motion.div key={item.text}
                      initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                      className="activity-card-nested flex flex-col items-center text-center group">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-muted text-4xl shadow-sm border border-white transition-transform group-hover:scale-110 group-hover:rotate-3">
                        {item.emoji}
                      </div>
                      <p className="mt-5 text-lg font-bold leading-relaxed text-text-dark">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Skills Built */}
              <motion.section className="activity-card"
                initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
                <div className="text-center">
                  <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">Skills Built</div>
                  <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">End with growth students can feel</h2>
                  <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto mb-8">
                    Reflect on the full journey from product thinking to design to speaking.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {SKILLS.map((skill, i) => (
                    <AchievementBadge key={skill.name} emoji={skill.emoji} name={skill.name} unlocked={true} delay={i * 0.08} />
                  ))}
                </div>
              </motion.section>

              <CircuitDivider />

              {/* Teacher Tips (formerly sidebar) */}
              <motion.section className="activity-card"
                initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
                <div className="text-center">
                  <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">Final Reminder</div>
                  <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Tips for Teachers</h2>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-[18px] border border-white/50 bg-white/60 px-5 py-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/35">Best Flow</div>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-text-mid">Brand → Features → Wow factor → Price → Promotion</p>
                  </div>
                  <div className="rounded-[18px] border border-white/50 bg-white/60 px-5 py-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/35">Classroom Tip</div>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-text-mid">Let students hold the sketch while they pitch so the audience sees the invention clearly.</p>
                  </div>
                  <div className="rounded-[18px] border border-primary/10 bg-primary/[0.04] px-5 py-5 text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/40">Celebrate</div>
                    <p className="mt-2 font-[Fredoka] text-lg font-bold leading-relaxed text-text-dark">End by asking the room which wearable they would most want to use.</p>
                  </div>
                </div>
              </motion.section>

              {/* Completion Message */}
              <motion.section className="activity-card text-center"
                initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
                <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/40">Completion</div>
                <h3 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark">Congratulations, Young CEO 🏆</h3>
                <p className="mt-4 max-w-2xl mx-auto text-lg font-medium leading-relaxed text-text-mid">
                  Students have now worked through invention, branding, teamwork, and presentation in one connected course journey. They thought like inventors, designed like creators, and spoke like founders.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link to="/" className="no-underline">
                    <button className="btn-secondary px-8 py-4 text-base">Back to Home</button>
                  </Link>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </ChapterLayout>
    </>
  )
}
