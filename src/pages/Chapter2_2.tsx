import { lazy, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useXP } from '../context/XPContext'
import { ChapterLayout } from '../components/ChapterLayout'
import { ROLES } from '../constants'
import CircuitDivider from '../components/CircuitDivider'

const Scene_Boardroom = lazy(() => import('../components/Scene_Boardroom'))

const roleDetails: Record<string, { responsibilities: string[] }> = {
  creator: { responsibilities: ['Define the features of the smart wearable device', 'Explain how the device works', 'Make sure the invention solves a real problem'] },
  innovator: { responsibilities: ['Identify what makes the invention unique', 'Explain why people would choose this wearable', 'Create the innovation line'] },
  designer: { responsibilities: ['Design the wearable look and branding', 'Choose colors, labels, and logo style', 'Create the tagline'] },
  money: { responsibilities: ['Decide the price of the wearable device', 'Explain why the price makes sense', 'Keep the price realistic for families'] },
  marketing: { responsibilities: ['Create the promotion idea', 'Think about the poster, ad, or reel', 'Explain how people will discover the product'] },
}

const marketingIdeas = [
  { emoji: '🖼️', name: 'Poster', desc: 'A classroom poster with the product name and wow feature.' },
  { emoji: '🎵', name: 'Jingle', desc: 'A short catchy line students can sing or say together.' },
  { emoji: '📱', name: 'Pretend Post', desc: 'A fake social post that shows the wearable in action.' },
  { emoji: '🎬', name: 'Mini Ad Scene', desc: 'A short roleplay showing the gadget solving a problem.' },
]

export default function Chapter2_2() {
  const { addXP } = useXP()
  const r = useReducedMotion()
  const [activeRole, setActiveRole] = useState<string | null>(null)

  useEffect(() => { addXP(15, 'ch2_2_visit') }, [addXP])

  const activeRoleData = ROLES.find(r => r.id === activeRole)
  const activeRoleDetails = activeRole ? roleDetails[activeRole] : null

  return (
    <ChapterLayout
      scene={<Scene_Boardroom />}
      moduleChapter="Module 2 · Chapter 2"
      title={<>Team<br /><span className="rainbow-text">Roleplay</span> 💼</>}
      desc="Students step into startup roles so they can understand how one invention becomes stronger when different people own different jobs."
      chips={
        <>
          <span className="activity-chip-info">👥 5 startup roles</span>
          <span className="activity-chip-info">⚙️ Clear responsibilities</span>
          <span className="activity-chip-info">📣 Speaking lines</span>
        </>
      }
      heroActions={
        <>
          <Link to="/final" className="no-underline">
             <button className="btn-primary text-xl px-12 py-5 shadow-xl">Next: Final Pitch →</button>
          </Link>
          <a href="#role-cards" className="btn-secondary px-8 py-5 text-base">View Roles ↓</a>
        </>
      }
      heroAside={
        <img 
          src="/images/ch2_2_team_1776241857401.png" 
          alt="Floating Puzzle Pieces for Teamwork" 
          className="mx-auto w-full max-w-sm rounded-[32px] shadow-2xl object-cover transform transition-transform hover:scale-110"
        />
      }
    >
      {/* Main Content */}
      <div className="activity-content">
        <div className="activity-grid">
          <div className="activity-main">
            
            {/* Why This Chapter Works */}
            <motion.section className="activity-card activity-card-accent"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-white/60">Teaching Goal</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-white md:text-4xl">A startup is a team effort</h2>
                <p className="mt-3 text-base font-medium text-white/70 max-w-2xl mx-auto">
                  Each role gives students a smaller, clearer job. That makes the startup feel easier to understand and easier to present as a group.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {['Each student gets one focus', 'Responsibilities are easier to remember', 'The final pitch feels more collaborative'].map((tip, i) => (
                  <motion.div key={tip}
                    initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="rounded-[18px] border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-semibold text-white/90 backdrop-blur-sm">
                    {tip}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <CircuitDivider />

             {/* Role Selector */}
            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">Role Selector</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Pick a role to explore</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">Click a role to see responsibilities and speaking lines.</p>
              </div>
              <div className="mt-8 role-selector-grid">
                {ROLES.map((role) => (
                  <button key={role.id} onClick={() => setActiveRole(activeRole === role.id ? null : role.id)} className={`role-selector-btn ${activeRole === role.id ? 'active' : ''}`}>
                    <div className="role-selector-icon">{role.emoji}</div>
                    <div className="font-[Fredoka] text-base font-bold text-text-dark">{role.title}</div>
                    <div className="text-xs font-medium text-text-mid">{role.focus}</div>
                  </button>
                ))}
              </div>

              {/* Active Role Detail */}
              <AnimatePresence mode="wait">
                {activeRoleData && activeRoleDetails && (
                  <motion.div
                    key={activeRole}
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.35 }}
                    className="mt-8 activity-card-nested flex flex-col gap-6 text-left w-full">
                    <div className="flex items-center gap-6">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-muted text-4xl border border-white shrink-0 shadow-sm">{activeRoleData.emoji}</div>
                      <div>
                        <h3 className="font-[Fredoka] text-3xl font-bold text-text-dark">{activeRoleData.title}</h3>
                        <div className="mt-2 text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full w-fit">{activeRoleData.focus}</div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="rounded-[20px] bg-primary/[0.03] p-7 border border-primary/5">
                        <div className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-primary/40 mb-4">Responsibilities</div>
                        <ul className="space-y-3">
                          {activeRoleDetails.responsibilities.map((resp: string) => (
                            <li key={resp} className="flex items-start gap-3 text-lg font-medium text-text-mid leading-snug">
                              <span className="text-primary mt-1">✦</span><span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[20px] bg-secondary/[0.04] p-7 border border-secondary/10 flex flex-col items-center">
                        <div className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-secondary/60 mb-4">Say This</div>
                        <p className="text-center font-[Fredoka] text-[1.45rem] font-bold text-text-dark leading-tight italic">"{activeRoleData.say}"</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Role Cards List */}
            <motion.section className="activity-card" id="role-cards"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/50">Role Cards</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">One content card per role</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">
                  The cards below separate the role, the job, and the sample speaking line so students are not overloaded.
                </p>
              </div>

              <div className="mt-10 grid gap-10 md:grid-cols-2">
                {ROLES.map((role, i) => {
                  const details = roleDetails[role.id]
                  return (
                    <motion.div key={role.id}
                      initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                      className="activity-card-nested flex flex-col gap-6 text-left">
                      
                      <div className="flex items-center gap-6">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-muted text-4xl border border-white shrink-0 shadow-sm">
                          {role.emoji}
                        </div>
                        <div>
                          <div className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-primary/50">Role {i + 1}</div>
                          <h3 className="font-[Fredoka] text-3xl font-bold text-text-dark mt-1">{role.title}</h3>
                          <div className="mt-2 text-xs font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full w-fit">
                            {role.focus}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="rounded-[20px] bg-primary/[0.03] p-7 border border-primary/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]">
                          <div className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-primary/40 mb-4 font-bold">Responsibilities</div>
                          <ul className="space-y-3">
                            {details.responsibilities.map((r) => (
                              <li key={r} className="flex items-start gap-3 text-lg font-medium text-text-mid leading-snug">
                                <span className="text-primary mt-1">✦</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="rounded-[20px] bg-secondary/[0.04] p-7 border border-secondary/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] flex flex-col items-center">
                          <div className="text-[0.7rem] font-black uppercase tracking-[0.25em] text-secondary/60 mb-4 font-bold">Say This</div>
                          <p className="text-center font-[Fredoka] text-[1.45rem] font-bold text-text-dark leading-tight italic">
                            "{role.say}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>

            {/* Marketing Bonus */}
             <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/50">Bonus</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Marketing Ideas</h2>
                <p className="mt-3 text-base font-medium text-text-mid max-w-2xl mx-auto">
                  If one student is handling promotion, these give them a smaller activity inside the bigger team task.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {marketingIdeas.map((idea, i) => (
                  <motion.div key={idea.name}
                    initial={r ? undefined : { opacity: 0, y: 16 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={r ? undefined : { duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center rounded-[18px] border border-primary/10 bg-white/60 p-5 text-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-2xl shadow-sm border border-white">
                      {idea.emoji}
                    </div>
                    <div className="mt-4 font-[Fredoka] text-lg font-bold text-text-dark">{idea.name}</div>
                    <div className="mt-2 text-sm font-medium text-text-mid leading-relaxed">{idea.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
            
            {/* Teacher Sidebar integrated to bottom */}
            <motion.section className="activity-card"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-center">
                <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/50">Teacher Prompts</div>
                <h2 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark md:text-4xl">Guiding the Roleplay</h2>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[18px] border border-white/50 bg-white/60 px-5 py-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/35">Quick Prompt</div>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-text-mid">Ask: "If this were a real startup, what job would you want and why?"</p>
                </div>
                <div className="rounded-[18px] border border-white/50 bg-white/60 px-5 py-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/35">Simple Goal</div>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-text-mid">Each student should know one role, one responsibility, and one line they can speak.</p>
                </div>
                <div className="sm:col-span-2 rounded-[18px] border border-primary/10 bg-primary/[0.04] px-5 py-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] text-center">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-primary/40">Final Bridge</div>
                  <p className="mt-2 font-[Fredoka] text-xl font-bold leading-relaxed text-text-dark">Use the roles in the Shark Pitch so every student has a moment to speak.</p>
                </div>
              </div>
            </motion.section>

             {/* Finish Section */}
            <motion.section className="activity-card text-center"
              initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }} transition={r ? undefined : { duration: 0.5 }}>
              <div className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-primary/40">Finish Chapter</div>
              <h3 className="mt-3 font-[Fredoka] text-3xl font-bold text-text-dark">Bring the team to the pitch stage</h3>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link to="/final" className="no-underline">
                  <button className="btn-primary text-lg px-10 py-4">Next: Final Pitch →</button>
                </Link>
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </ChapterLayout>
  )
}
