import React, { Suspense } from 'react'
import { motion } from 'framer-motion'

export interface ChapterLayoutProps {
  scene: React.ReactNode
  moduleChapter: string
  title: React.ReactNode
  desc?: string
  chips?: React.ReactNode
  heroActions?: React.ReactNode
  heroAside?: React.ReactNode
  heroBottom?: React.ReactNode
  tracker?: React.ReactNode
  children: React.ReactNode
}

export function ChapterLayout({
  scene,
  moduleChapter,
  title,
  desc,
  chips,
  heroActions,
  heroAside,
  heroBottom,
  tracker,
  children
}: ChapterLayoutProps) {
  return (
    <div className="activity-centre">
      <Suspense fallback={null}>
        {scene}
      </Suspense>

      <section className="activity-hero">
        <div className="activity-hero-content">
          <motion.div className="activity-hero-text" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="activity-hero-badge">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-pulse shadow-lg shadow-secondary/40" />
              <span className="text-xs font-black uppercase tracking-[0.28em] text-text-mid">{moduleChapter}</span>
            </div>
            <h1 className="activity-hero-title">
              {title}
            </h1>
            
            {desc && <p className="activity-hero-desc mt-8">{desc}</p>}

            {chips && (
              <div className="flex flex-wrap gap-3 mt-6">
                {chips}
              </div>
            )}

            {heroActions && (
              <div className="flex flex-col items-center gap-4 mt-10 sm:flex-row">
                {heroActions}
              </div>
            )}

            {heroBottom}
          </motion.div>

          {heroAside && (
            <motion.div className="activity-hero-aside"
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}>
              {heroAside}
            </motion.div>
          )}
        </div>
      </section>

      {tracker && (
        <div className="activity-content" style={{ marginBottom: '1rem' }}>
          {tracker}
        </div>
      )}

      {children}
    </div>
  )
}
