'use client'

import { motion } from 'framer-motion'
import { type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/cn'

interface SceneProps {
  accent?: string
  onBack?: () => void
  children: ReactNode
  className?: string
}

/** Full-viewport stage for one question. The orchestrator keys it for enter/exit. */
export default function Scene({ accent = 'var(--color-solar)', onBack, children, className }: SceneProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ '--accent': accent } as CSSProperties}
      className={cn('relative flex h-[100svh] w-full flex-col overflow-hidden bg-paper', className)}
    >
      {children}

      {onBack && (
        <button
          onClick={onBack}
          data-cursor
          className="group absolute bottom-5 left-5 z-30 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft md:bottom-8 md:left-10"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Back
        </button>
      )}
    </motion.section>
  )
}
