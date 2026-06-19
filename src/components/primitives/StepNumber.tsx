'use client'

import { motion } from 'framer-motion'
import { type CSSProperties } from 'react'
import { cn } from '@/lib/cn'

interface StepNumberProps {
  n: number
  total?: number
  className?: string
  hollow?: boolean
  size?: string
}

/** The progress indicator: an enormous step number. Current step becomes the artwork. */
export default function StepNumber({
  n,
  total = 8,
  className,
  hollow = true,
  size = 'clamp(7rem, 30vw, 28rem)',
}: StepNumberProps) {
  return (
    <div className={cn('pointer-events-none select-none font-display font-semibold leading-[0.7]', className)} aria-hidden>
      <motion.span
        key={n}
        initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn('block', hollow && 'text-hollow')}
        style={{ fontSize: size } as CSSProperties}
      >
        {String(n).padStart(2, '0')}
      </motion.span>
      <span className="mt-2 block text-xs font-medium uppercase tracking-[0.3em] text-ink-soft">
        Step {n} of {total}
      </span>
    </div>
  )
}
