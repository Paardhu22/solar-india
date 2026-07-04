'use client'

import { motion, AnimatePresence } from 'framer-motion'

import Image from 'next/image'

interface NavProps {
  step?: number // 1-based; omit outside the question flow
  total?: number
  onSkip?: () => void
  onHome?: () => void
  invert?: boolean
}

/** Minimal chrome with logo, progress, and skip button */
export default function Navigation({ step, total, onSkip, onHome, invert }: NavProps) {
  const ink = invert ? 'text-paper' : 'text-ink'
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 md:py-6 ${ink}`}
    >
      <div className="flex items-center">
        {onHome ? (
          <button onClick={onHome} className="flex items-center hover:opacity-75 transition-opacity">
            <Image src="/logo.png" alt="Ashwitha Energy Services" width={48} height={48} className="object-contain" priority />
          </button>
        ) : (
          <div className="flex items-center">
            <Image src="/logo.png" alt="Ashwitha Energy Services" width={48} height={48} className="object-contain" priority />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 md:gap-8">
        <AnimatePresence>
          {step && total ? (
            <motion.span
              key="progress"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="tnum text-[11px] font-medium uppercase tracking-[0.28em] md:text-xs"
            >
              {String(step).padStart(2, '0')}
              <span className="mx-1 opacity-40">—</span>
              {String(total).padStart(2, '0')}
            </motion.span>
          ) : null}
        </AnimatePresence>

        {onSkip && (
          <button
            onClick={onSkip}
            data-cursor
            className="group relative text-[11px] font-medium uppercase tracking-[0.28em] md:text-xs"
          >
            Skip
            <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
          </button>
        )}
      </div>
    </nav>
  )
}
