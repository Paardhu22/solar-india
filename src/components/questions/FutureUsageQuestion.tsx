'use client'

import { motion } from 'framer-motion'
import type { FutureUsage } from '@/types'
import Scene from './Scene'
import SplitText from '@/components/primitives/SplitText'
import StepNumber from '@/components/primitives/StepNumber'

interface Props {
  value?: FutureUsage
  onAnswer: (v: FutureUsage) => void
  onBack?: () => void
}

const OPTIONS: { key: FutureUsage; label: string; offset: string }[] = [
  { key: 'same', label: 'About the same', offset: 'md:ml-0' },
  { key: 'slight', label: 'A little more', offset: 'md:ml-[7vw]' },
  { key: 'significant', label: 'A lot more', offset: 'md:ml-[14vw]' },
  { key: 'ev', label: 'Buying an EV', offset: 'md:ml-[9vw]' },
  { key: 'more_acs', label: 'Adding more ACs', offset: 'md:ml-[3vw]' },
]

// Q8 — a diagonal cascade of type. Answering this fires the calculation.
export default function FutureUsageQuestion({ value, onAnswer, onBack }: Props) {
  return (
    <Scene accent="var(--color-pink)" onBack={onBack}>
      <StepNumber n={8} className="absolute -bottom-10 right-2 z-0 md:right-8" />

      <div className="relative z-10 flex h-full flex-col justify-center px-5 pt-20 md:px-10 md:pt-0">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.3em] text-ink-soft">
          Last one — your future
        </p>
        <h2 className="mb-10 font-display text-[11vw] font-semibold leading-[0.84] md:mb-12 md:text-[5.5vw]">
          <SplitText per="word" stagger={0.05}>Where is your power use headed?</SplitText>
        </h2>

        <div className="flex flex-col gap-1">
          {OPTIONS.map((o, i) => {
            const selected = value === o.key
            return (
              <motion.button
                key={o.key}
                data-cursor
                onClick={() => onAnswer(o.key)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex items-baseline gap-4 text-left ${o.offset}`}
              >
                <span className="tnum w-8 shrink-0 text-sm text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
                <span
                  className={`font-display font-semibold leading-[0.95] tracking-tight transition-colors duration-200 ${
                    selected ? 'text-pink' : 'text-ink group-hover:text-pink'
                  }`}
                  style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}
                >
                  {o.label}
                </span>
                <span
                  className={`hidden text-pink transition-all duration-300 md:inline ${
                    selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                >
                  →
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </Scene>
  )
}
