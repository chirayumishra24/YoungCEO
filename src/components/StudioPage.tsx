import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const ease = [0.22, 1, 0.36, 1] as const

const cardStyles = {
  content:
    'rounded-[28px] border border-white/60 bg-white/75 p-6 backdrop-blur-xl md:p-8 shadow-[6px_6px_16px_rgba(108,92,231,0.06),-3px_-3px_10px_rgba(255,255,255,0.85),inset_0_2px_3px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(108,92,231,0.03)]',
  interactive:
    'rounded-[28px] border border-white/60 bg-white/80 p-6 backdrop-blur-xl md:p-8 shadow-[6px_6px_16px_rgba(108,92,231,0.07),-3px_-3px_10px_rgba(255,255,255,0.85),inset_0_2px_3px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(108,92,231,0.03)]',
  accent:
    'rounded-[28px] border border-white/15 bg-gradient-to-br from-[#7B6CF0] via-primary to-primary-dark p-6 text-white md:p-8 shadow-[8px_8px_24px_rgba(90,75,209,0.35),-4px_-4px_12px_rgba(140,130,240,0.2),inset_0_2px_6px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(72,52,191,0.3)]',
  summary:
    'rounded-[28px] border border-white/60 bg-surface-soft/80 p-6 backdrop-blur-md md:p-7 shadow-[6px_6px_16px_rgba(108,92,231,0.05),-3px_-3px_10px_rgba(255,255,255,0.85),inset_0_2px_3px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(108,92,231,0.03)]',
} as const

type SectionCardProps = {
  children: ReactNode
  className?: string
  delay?: number
  hover?: boolean
  id?: string
  variant?: keyof typeof cardStyles
}

export function PageContainer({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return <div id={id} className={cx('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>
}

export function StudioPage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('relative w-full overflow-hidden pb-24', className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-20 h-64 w-64 rounded-full bg-primary/[0.06] blur-[80px]" />
        <div className="absolute right-[-8%] top-60 h-72 w-72 rounded-full bg-secondary/[0.06] blur-[80px]" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-accent-orange/[0.06] blur-[80px]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export function MotionGroup({ children, className = '', delayChildren = 0, stagger = 0.08 }: { children: ReactNode; className?: string; delayChildren?: number; stagger?: number }) {
  const r = useReducedMotion()
  return (
    <motion.div className={className} initial={r ? undefined : 'hidden'} whileInView={r ? undefined : 'visible'} viewport={{ once: true, amount: 0.18 }}
      variants={r ? undefined : { hidden: {}, visible: { transition: { delayChildren, staggerChildren: stagger } } }}>
      {children}
    </motion.div>
  )
}

export function MotionItem({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const r = useReducedMotion()
  return (
    <motion.div className={className}
      variants={r ? undefined : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease } } }}>
      {children}
    </motion.div>
  )
}

export function SectionCard({ children, className = '', delay = 0, hover = false, id, variant = 'content' }: SectionCardProps) {
  const r = useReducedMotion()
  return (
    <motion.section id={id} className={cx(cardStyles[variant], className)}
      initial={r ? undefined : { opacity: 0, y: 20 }} whileInView={r ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.5, delay, ease }}
      whileHover={hover && !r ? { y: -5, scale: 1.01 } : undefined}>
      {children}
    </motion.section>
  )
}

export function InfoPill({ children, className = '', tone = 'light' }: { children: ReactNode; className?: string; tone?: 'light' | 'dark' }) {
  return (
    <span className={cx(
      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
      tone === 'dark'
        ? 'border border-white/15 bg-white/10 text-white/80'
        : 'border border-white/60 bg-white/70 text-text-mid shadow-[3px_3px_8px_rgba(108,92,231,0.05),-2px_-2px_6px_rgba(255,255,255,0.8),inset_0_1px_2px_rgba(255,255,255,0.6)]',
      className,
    )}>
      {children}
    </span>
  )
}

export function SectionHeader({ action, description, eyebrow, title }: { action?: ReactNode; description?: ReactNode; eyebrow?: ReactNode; title: ReactNode }) {
  return (
    <div className="text-center">
      <div className="mx-auto max-w-3xl">
        {eyebrow && <div className="text-[0.72rem] font-black uppercase tracking-[0.28em] text-primary/60">{eyebrow}</div>}
        <h2 className="mt-3 font-[Fredoka] text-3xl font-bold leading-tight text-text-dark md:text-4xl">{title}</h2>
        {description && <div className="mt-3 text-base font-medium leading-relaxed text-text-mid md:text-lg">{description}</div>}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function HeroBand({ actions, aside, chips, description, eyebrow, title }: { actions?: ReactNode; aside?: ReactNode; chips?: ReactNode; description: ReactNode; eyebrow: ReactNode; title: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-18 md:pb-20 md:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-8 h-72 w-72 rounded-full bg-primary/[0.07] blur-[80px]" />
        <div className="absolute right-[-6%] top-0 h-80 w-80 rounded-full bg-secondary/[0.06] blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent-orange/[0.06] blur-[80px]" />
      </div>

      <PageContainer className={cx('grid items-center gap-10', aside ? 'lg:grid-cols-[minmax(0,1fr)_380px]' : '')}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-5 py-2.5 backdrop-blur-xl shadow-[4px_4px_12px_rgba(108,92,231,0.06),-2px_-2px_8px_rgba(255,255,255,0.8),inset_0_1px_2px_rgba(255,255,255,0.6)]">
            {eyebrow}
          </div>
          <h1 className="mt-6 font-[Fredoka] text-5xl font-bold leading-[1.05] tracking-tight text-text-dark md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <div className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-relaxed text-text-mid md:text-xl">{description}</div>
          {chips && <div className="mt-7 flex flex-wrap justify-center gap-3">{chips}</div>}
          {actions && <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">{actions}</div>}
        </motion.div>

        {aside && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease }} className="mx-auto w-full max-w-[380px]">
            {aside}
          </motion.div>
        )}
      </PageContainer>
    </section>
  )
}
