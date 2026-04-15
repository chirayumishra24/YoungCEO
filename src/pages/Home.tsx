import { Suspense, lazy, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { XPContext } from '../components/Layout'
import { IMAGES, SKILLS } from '../constants'
import CircuitDivider from '../components/CircuitDivider'

const ThreeBackground = lazy(() => import('../components/ThreeBackground'))

const modules = [
  {
    id: '01',
    title: 'Startup Designers',
    clayTheme: 'clay-blue',
    subtitle: 'Students invent the wearable, decide the problem, and shape the brand.',
    chapters: [
      { path: '/1-1', num: '1.1', title: 'Build Your Product Idea', desc: 'Choose the problem, wearable, powers, and simple startup pitch.', chips: ['Mission first', 'Pick a device', 'Set the wow feature'] },
      { path: '/1-2', num: '1.2', title: 'Wearable Design Lab', desc: 'Turn the invention into a real-looking brand, sketch, and final preview.', chips: ['Brand name', 'Tagline', 'Draw the design'] },
    ],
  },
  {
    id: '02',
    title: 'Startup Presenters',
    clayTheme: 'clay-pink',
    subtitle: 'Students learn how to explain, present, and roleplay the startup team.',
    chapters: [
      { path: '/2-1', num: '2.1', title: 'Startup Pitch', desc: 'Follow a clear pitch recipe with examples students can actually say.', chips: ['5 pitch parts', 'Examples', 'Presentation tips'] },
      { path: '/2-2', num: '2.2', title: 'Team Roleplay', desc: 'See how different startup roles work together to build one strong idea.', chips: ['Meet the roles', 'Use key lines', 'Practice teamwork'] },
    ],
  },
]

const studioSteps = [
  { emoji: '🧪', title: 'Invent', desc: 'Start with a student problem so the product has a purpose.', theme: 'clay-blue' },
  { emoji: '🎨', title: 'Design', desc: 'Build the brand and sketch so the idea looks real.', theme: 'clay-pink' },
  { emoji: '🎤', title: 'Pitch', desc: 'Guide students to explain the invention clearly and confidently.', theme: 'clay-yellow' },
]

export default function Home() {
  const { addXP } = useContext(XPContext)
  const r = useReducedMotion()

  useEffect(() => {
    addXP(5, 'home_visit')
  }, [addXP])

  return (
    <div className="activity-centre">
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-[-1] hidden lg:block opacity-30">
          <ThreeBackground />
        </div>
      </Suspense>

      {/* Hero Section - Asymmetrical Alignment */}
      <section className="activity-hero">
        <div className="activity-hero-content">
          <motion.div className="flex-1 text-left" initial={r ? undefined : { opacity: 0, x: -30 }} animate={r ? undefined : { opacity: 1, x: 0 }} transition={r ? undefined : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="activity-hero-badge inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/60 rounded-full border border-white backdrop-blur-md shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/40" />
              <span className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-text-mid">Grades 3-4 Studio</span>
            </div>
            <h1 className="activity-hero-title mb-6 leading-[1.1]">
              Young CEO<br />
              <span className="rainbow-text block mt-2">Challenge</span>
            </h1>
            
            <p className="activity-hero-desc text-text-mid max-w-xl text-lg mb-8 text-left mx-0">
              A cleaner, more structured startup course where students invent a smart wearable, design the brand, and pitch it like young founders.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="activity-chip-info">📦 2 modules</span>
              <span className="activity-chip-info">🚀 4 chapter journey</span>
              <span className="activity-chip-info">⭐ 500 XP challenge</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/1-1" className="no-underline">
                <button className="btn-primary text-lg px-8 py-4 shadow-[8px_8px_0px_#A259FF] hover:translate-y-1 hover:shadow-[4px_4px_0px_#A259FF] transition-all">Start The Course →</button>
              </Link>
              <a href="#course-map" className="btn-secondary px-8 py-4 text-base bg-white border-primary/20 text-text-mid hover:bg-surface-soft transition-colors">Course Map ↓</a>
            </div>
          </motion.div>

          <motion.div className="flex-1 hidden md:flex justify-center items-center relative" initial={r ? undefined : { opacity: 0, x: 30 }} animate={r ? undefined : { opacity: 1, x: 0 }} transition={r ? undefined : { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform -translate-y-10 scale-110"></div>
              <img src="/images/home_hero_img_1776241796217.png" alt="Young CEO Smart Watch" className="relative z-10 w-full rounded-[40px] shadow-[16px_16px_36px_rgba(108,92,231,0.1),-16px_-16px_36px_rgba(255,255,255,0.9),inset_6px_6px_16px_rgba(255,255,255,0.8)] border border-white object-cover transform rotate-2 hover:rotate-0 transition-transform duration-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="activity-content mt-10">
        <div className="activity-grid">
          <div className="activity-main w-full">
            
            {/* Colorful Clay Course Structure */}
            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/50">Course Structure</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">A structure that feels playful</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Each chapter now follows the same rhythm: clear hero, objective card, stacked content cards, and a simple end CTA.</p>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-3 w-full">
                {studioSteps.map((step, i) => (
                  <motion.div key={step.title}
                    initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className={`flex flex-col items-center p-8 transition-transform hover:-translate-y-2 activity-card ${step.theme}`} style={{ width: '100%' }}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-3xl shadow-sm border border-white/80">{step.emoji}</div>
                    <div className="mt-6 font-[Fredoka] text-2xl font-bold text-text-dark">{step.title}</div>
                    <div className="mt-3 text-sm font-medium text-text-mid leading-relaxed">{step.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <CircuitDivider />

            {/* Teacher Benefit - Green Clay */}
            <motion.section className="activity-card clay-green"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center w-full">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-green-600/60">Teacher Benefit</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Build a believable startup story.</h2>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-3 w-full">
                {[
                  'Start with the real student problem first',
                  'Use simple prompts instead of heavy jargon',
                  'Keep each chapter visually consistent',
                ].map((point, i) => (
                  <motion.div key={point}
                    initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center text-center gap-4 rounded-[24px] border border-white bg-white/50 p-6 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-black text-xl">{i + 1}</div>
                    <span className="text-base font-bold text-text-dark">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <CircuitDivider />

            {/* Colorful Course Map */}
            <motion.section className="activity-card" id="course-map"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/50">Course Map</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">The Chapter Journey</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Two main modules mapped out into individual, interactive chapters.</p>
              </div>

              <div className="mt-12 flex flex-col gap-12 w-full">
                {modules.map((module) => (
                  <div key={module.id} className={`activity-card ${module.clayTheme} p-8 sm:p-12 w-full transition-shadow hover:shadow-[16px_16px_40px_rgba(108,92,231,0.08),-16px_-16px_40px_rgba(255,255,255,1)]`}>
                    <div className="flex flex-col gap-2 text-center mb-10 w-full">
                      <div className="mx-auto w-fit px-4 py-1.5 rounded-full bg-white/80 border border-white shadow-sm text-[0.68rem] font-black uppercase tracking-[0.26em] text-text-mid">Module {module.id}</div>
                      <h3 className="font-[Fredoka] text-4xl font-bold text-text-dark mt-2">{module.title}</h3>
                      <p className="mx-auto max-w-xl text-base font-medium leading-relaxed text-text-mid mt-3">{module.subtitle}</p>
                    </div>

                    <div className="flex flex-col gap-5 w-full">
                      {module.chapters.map((chapter) => (
                        <Link key={chapter.path} to={chapter.path} className="block no-underline transform transition-transform hover:-translate-y-1">
                          <div className="rounded-[28px] border border-white/80 bg-white/70 p-6 sm:p-8 shadow-[8px_8px_20px_rgba(0,0,0,0.03),-4px_-4px_12px_rgba(255,255,255,0.8)] hover:bg-white/90">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-sm font-black text-text-mid shadow-inner border border-white/50">{chapter.num}</div>
                                  <h4 className="font-[Fredoka] text-2xl font-bold text-text-dark">{chapter.title}</h4>
                                </div>
                                <p className="mt-3 text-sm font-medium leading-relaxed text-text-mid md:ml-13 sm:w-11/12">{chapter.desc}</p>
                              </div>
                              <div className="hidden lg:flex shrink-0 flex-wrap gap-2 sm:max-w-xs sm:justify-end">
                                {chapter.chips.map((chip) => (
                                  <span key={chip} className="inline-flex rounded-full bg-surface-muted border border-border-soft px-3 py-1.5 text-xs font-bold text-text-mid whitespace-nowrap">
                                    {chip}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
            
          </div>
        </div>
      </div>
    </div>
  )
}
