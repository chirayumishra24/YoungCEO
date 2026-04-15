import { Suspense, lazy, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { XPContext } from '../components/Layout'
import { IMAGES, SKILLS } from '../constants'

const ThreeBackground = lazy(() => import('../components/ThreeBackground'))

const modules = [
  {
    id: '01',
    title: 'Startup Designers',
    tone: 'from-secondary to-accent-green',
    subtitle: 'Students invent the wearable, decide the problem, and shape the brand.',
    chapters: [
      {
        path: '/1-1',
        num: '1.1',
        title: 'Build Your Product Idea',
        desc: 'Choose the problem, wearable, powers, and simple startup pitch.',
        chips: ['Mission first', 'Pick a device', 'Set the wow feature'],
      },
      {
        path: '/1-2',
        num: '1.2',
        title: 'Wearable Design Lab',
        desc: 'Turn the invention into a real-looking brand, sketch, and final preview.',
        chips: ['Brand name', 'Tagline', 'Draw the design'],
      },
    ],
  },
  {
    id: '02',
    title: 'Startup Presenters',
    tone: 'from-accent-orange to-accent-pink',
    subtitle: 'Students learn how to explain, present, and roleplay the startup team.',
    chapters: [
      {
        path: '/2-1',
        num: '2.1',
        title: 'Startup Pitch',
        desc: 'Follow a clear pitch recipe with examples students can actually say.',
        chips: ['5 pitch parts', 'Examples', 'Presentation tips'],
      },
      {
        path: '/2-2',
        num: '2.2',
        title: 'Team Roleplay',
        desc: 'See how different startup roles work together to build one strong idea.',
        chips: ['Meet the roles', 'Use key lines', 'Practice teamwork'],
      },
    ],
  },
]

const studioSteps = [
  {
    emoji: '🧪',
    title: 'Invent',
    desc: 'Start with a student problem so the product has a purpose.',
  },
  {
    emoji: '🎨',
    title: 'Design',
    desc: 'Build the brand and sketch so the idea looks real.',
  },
  {
    emoji: '🎤',
    title: 'Pitch',
    desc: 'Guide students to explain the invention clearly and confidently.',
  },
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
        <div className="fixed inset-0 z-[-1] hidden lg:block opacity-40 mix-blend-multiply">
          <ThreeBackground />
        </div>
      </Suspense>

      {/* Hero Section */}
      <section className="activity-hero">
        <motion.div className="activity-hero-content" initial={r ? undefined : { opacity: 0, y: 30 }} animate={r ? undefined : { opacity: 1, y: 0 }} transition={r ? undefined : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div className="activity-hero-badge">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse shadow-lg shadow-secondary/40" />
            <span className="text-xs font-black uppercase tracking-[0.28em] text-text-mid">Grades 3-4 Wearable Studio</span>
          </div>
          <h1 className="activity-hero-title">
            Young CEO<br />
            <span className="rainbow-text">Challenge</span>
          </h1>
          
          <div className="mt-8 flex justify-center">
            <img 
              src="/images/home_hero_img_1776241796217.png" 
              alt="Young CEO Smart Watch" 
              className="max-w-xs md:max-w-sm rounded-[32px] shadow-2xl object-cover transform transition-transform hover:scale-105"
            />
          </div>

          <p className="activity-hero-desc mt-8">
            A cleaner, more structured startup course where students invent a smart wearable, design the brand, and pitch it like young founders.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="activity-chip-info">2 modules</span>
            <span className="activity-chip-info">4 chapter journey</span>
            <span className="activity-chip-info">500 XP challenge</span>
          </div>
          <div className="flex flex-col items-center gap-4 mt-8 sm:flex-row sm:justify-center">
            <Link to="/1-1" className="no-underline">
              <button className="btn-primary text-lg px-10 py-4">Start The Course</button>
            </Link>
            <a href="#course-map" className="btn-secondary px-8 py-4 text-base">View Course Map ↓</a>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="activity-content">
        <div className="activity-grid">
          <div className="activity-main">
            
            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/50">Course Structure</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">A basic structure that feels playful, not chaotic</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Each chapter now follows the same rhythm: clear hero, objective card, stacked content cards, and a simple end CTA.</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {studioSteps.map((step, i) => (
                  <motion.div key={step.title}
                    initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center rounded-[18px] border border-primary/10 bg-white/60 p-5 text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-surface-muted text-3xl shadow-sm border border-white/50">{step.emoji}</div>
                    <div className="mt-4 font-[Fredoka] text-xl font-bold text-text-dark">{step.title}</div>
                    <div className="mt-2 text-sm font-medium text-text-mid">{step.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section className="activity-card activity-card-accent"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-white/60">Teacher Benefit</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-white md:text-4xl">Students do not just decorate an idea. They build a believable startup story.</h2>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                {[
                  'Start with the real student problem first',
                  'Use simple prompts instead of heavy jargon',
                  'Keep each chapter visually consistent and easier to scan',
                ].map((point, i) => (
                  <motion.div key={point}
                    initial={r ? undefined : { opacity: 0, x: -10 }} whileInView={r ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-4 rounded-[16px] border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white font-bold">{i + 1}</div>
                    <span className="text-lg font-semibold text-white/90">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section className="activity-card" id="course-map"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/50">Course Map</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Chapter cards that look like one system</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">The chapter journey is simpler now: two module cards, each containing clear chapter cards.</p>
              </div>

              <div className="mt-8 flex flex-col gap-8">
                {modules.map((module) => (
                  <div key={module.id} className="rounded-[24px] border border-white/60 bg-surface-soft/40 p-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)]">
                    <div className="flex flex-col gap-2 text-center">
                      <div className="text-[0.68rem] font-black uppercase tracking-[0.26em] text-primary/40">Module {module.id}</div>
                      <h3 className="font-[Fredoka] text-3xl font-bold text-text-dark">{module.title}</h3>
                      <p className="mx-auto max-w-xl text-base font-medium leading-relaxed text-text-mid">{module.subtitle}</p>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                      {module.chapters.map((chapter) => (
                        <Link key={chapter.path} to={chapter.path} className="block no-underline">
                          <div className="group rounded-[20px] border border-primary/10 bg-white/80 p-5 shadow-[4px_4px_12px_rgba(108,92,231,0.06),-2px_-2px_8px_rgba(255,255,255,0.8)] transition-all hover:translate-y-[-2px] hover:shadow-[6px_6px_16px_rgba(108,92,231,0.1),-3px_-3px_10px_rgba(255,255,255,0.9)] hover:border-primary/20">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-left">
                              <div className="flex flex-col gap-1">
                                <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/50">Chapter {chapter.num}</div>
                                <h4 className="font-[Fredoka] text-xl font-bold text-text-dark group-hover:text-primary transition-colors">{chapter.title}</h4>
                                <p className="text-sm font-medium text-text-light">{chapter.desc}</p>
                              </div>
                              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                Open <span>→</span>
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/40 text-center">Final Challenge</div>
              <h3 className="mt-3 font-[Fredoka] text-4xl font-bold text-text-dark text-center">Finish with the Shark Pitch Competition</h3>
              <p className="mt-4 mx-auto max-w-2xl text-lg font-medium leading-relaxed text-text-mid text-center">
                Students carry their invention from concept to design to presentation, then step into a clean final stage that still feels exciting.
              </p>
              
              <div className="mt-8 rounded-[24px] border border-primary/5 bg-white/40 p-4 shadow-inner">
                 <img src={IMAGES.wearableHeader} alt="Smart wearable examples" className="w-full h-auto rounded-[16px] mix-blend-multiply" />
              </div>

              <div className="mt-8 flex justify-center">
                <Link to="/final" className="no-underline">
                  <button className="btn-secondary px-8 py-4 text-base">
                    Go To Final Pitch →
                  </button>
                </Link>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </div>
  )
}
