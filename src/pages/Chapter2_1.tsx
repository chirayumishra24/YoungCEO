import { Suspense, lazy, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useXP } from '../context/XPContext'
import { ChapterLayout } from '../components/ChapterLayout'
import CircuitDivider from '../components/CircuitDivider'

const Scene_Stage = lazy(() => import('../components/Scene_Stage'))

const pitchSteps = [
  { emoji: '⚙️', title: 'Features / Functions', prompt: 'What does your wearable do?', detail: 'Explain the main job of the invention and what problem it solves for the student.', example: 'Our SmartBand tracks location, counts steps, and sends an alert when the SOS button is pressed.' },
  { emoji: '✨', title: 'USP', prompt: 'Why is it special?', detail: 'Pick the one thing that makes the product feel different from other gadgets.', example: 'Unlike a normal band, ours glows in the dark and also helps you find your way home.' },
  { emoji: '🛡️', title: 'Safety + Design', prompt: 'Why is it safe and comfortable?', detail: 'Tell people how the wearable is easy to wear, safe to use, and helpful in real life.', example: 'It is lightweight, waterproof, and has a panic button for emergencies.' },
  { emoji: '💰', title: 'Price', prompt: 'How much will it cost?', detail: 'Share a simple student-friendly price so the product sounds believable.', example: 'We will sell it for ₹499 so families can afford it easily.' },
  { emoji: '📣', title: 'Marketing Idea', prompt: 'How will people hear about it?', detail: 'Choose one clear way to promote the invention instead of listing too many ideas.', example: 'We will show it at school fairs and make a fun reel for parents and students.' },
]

export default function Chapter2_1() {
  const { addXP } = useXP()
  const r = useReducedMotion()

  useEffect(() => { addXP(10, 'ch2_1_visit') }, [addXP])

  return (
    <ChapterLayout
      scene={<Scene_Stage />}
      moduleChapter="Module 2 · Chapter 1"
      title={<>Startup<br /><span className="rainbow-text">Pitch</span> 🎤</>}
      desc="Time to convince the investors why your smart wearable is the future! Keep it short, clear, and confident."
      chips={
        <>
          <span className="activity-chip-info">🎙️ Stage mode</span>
          <span className="activity-chip-info">📝 5 pitch parts</span>
          <span className="activity-chip-info">💡 Example lines</span>
        </>
      }
      heroActions={
        <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="btn-primary text-lg px-10 py-4">Start Pitch Prep ↓</button>
      }
      heroAside={
        <img src="/images/ch2_1_pitch_1776241841451.png" alt="Startup Pitch" className="mx-auto w-full max-w-sm rounded-[32px] shadow-2xl object-cover transform transition-transform hover:scale-105 hidden lg:block" />
      }
    >
      {/* Main Content */}
      <div className="activity-content">
        <div className="activity-grid">
          <div className="activity-main">
            
            {/* Teaching Focus */}
            <motion.section className="activity-card activity-card-accent"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-white/60">Teaching Focus</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-white md:text-4xl">Keep the pitch short, clear, and believable</h2>
                <p className="mt-3 text-base font-medium text-white/70 max-w-2xl mx-auto">
                  Students do not need a formal investor script. They need a clean order, a few confident sentences, and one simple promotion idea.
                </p>
              </div>
              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {['Start with what the wearable does', 'Share the special wow factor', 'End with price and promotion'].map((tip, i) => (
                  <motion.div key={tip}
                    initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="rounded-[22px] border border-white/20 bg-white/10 p-6 text-center text-base font-semibold text-white backdrop-blur-sm shadow-lg shadow-black/5">
                    {tip}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Checklist Overview */}
            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">One-Minute Checklist</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Before they go on stage</h2>
              </div>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div className="activity-card-nested">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/35">Pitch Order</div>
                  <p className="mt-3 text-base font-medium leading-relaxed text-text-mid">Features → USP → Safety → Price → Marketing</p>
                </div>
                <div className="activity-card-nested">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/35">Timing Guidelines</div>
                  <p className="mt-3 text-base font-medium leading-relaxed text-text-mid">Keep the pitch around 1 to 2 minutes for best classroom flow.</p>
                </div>
                <div className="sm:col-span-2 activity-card-nested activity-card-nested-accent text-center">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/40">Teacher Cue</div>
                  <p className="mt-3 font-[Fredoka] text-xl font-bold leading-relaxed text-text-dark">Ask: "What is the one sentence you want the audience to remember?"</p>
                </div>
              </div>
            </motion.section>

            <CircuitDivider />

            {/* Teleprompter Pitch Flow */}
            <motion.section className="activity-card" id="pitch-recipe"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/50">Pitch Flow</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Speaking Order</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">
                  Each card is one cue — read it, practice it, own it.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-5 w-full">
                {pitchSteps.map((step, i) => (
                  <motion.div key={step.title}
                    initial={r ? undefined : { opacity: 0, x: -20 }} whileInView={r ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="teleprompter-card">
                    <div className="flex gap-5 items-start">
                      <div className="teleprompter-num">{i + 1}</div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <h3 className="font-[Fredoka] text-xl font-bold text-text-dark">{step.emoji} {step.title}</h3>
                          <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            {step.prompt}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-text-mid">{step.detail}</p>
                        <div className="mt-4 rounded-[16px] bg-secondary/[0.04] px-4 py-3 border border-secondary/10">
                          <div className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-secondary/60">Example Line</div>
                          <p className="mt-1 text-sm italic font-medium leading-relaxed text-text-dark/80">"{step.example}"</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <CircuitDivider />

            {/* Presentation Rules */}
             <motion.section className="activity-card tilt-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/50">Presentation Tips</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Three habits to sound confident</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">
                  Simple delivery rules worth repeating before they present.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { emoji: '👀', title: 'Look up', desc: 'Tell students to look at the audience, not only the paper.' },
                  { emoji: '🗣️', title: 'Speak clearly', desc: 'Encourage short, strong lines instead of rushing through.' },
                  { emoji: '😊', title: 'Show excitement', desc: 'A student who feels proud makes the product feel better.' },
                ].map((tip, i) => (
                  <motion.div key={tip.title}
                    initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center rounded-[18px] border border-primary/10 bg-white/60 p-5 text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-2xl shadow-sm border border-white">
                      {tip.emoji}
                    </div>
                    <div className="mt-4 font-[Fredoka] text-lg font-bold text-text-dark">{tip.title}</div>
                    <div className="mt-2 text-sm font-medium text-text-mid leading-relaxed">{tip.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

             {/* Finish Section */}
            <motion.section className="activity-card text-center"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/40">Finish Chapter</div>
              <h3 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark">Who brings this pitch to life?</h3>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link to="/2-2" className="no-underline">
                  <button className="btn-primary text-lg px-10 py-4">Next: Team Roleplay →</button>
                </Link>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </ChapterLayout>
  )
}
