'use client'

import { motion } from 'framer-motion'
import type { CleaningFrequency } from '@/types'
import Scene from './Scene'
import SplitText from '@/components/primitives/SplitText'
import StepNumber from '@/components/primitives/StepNumber'

interface Props {
  value?: CleaningFrequency
  onAnswer: (v: CleaningFrequency) => void
  onBack?: () => void
}

const OPTIONS: { key: CleaningFrequency; label: string; sub: string; h: number }[] = [
  { key: 'weekly', label: 'Weekly', sub: 'Peak output', h: 100 },
  { key: 'monthly', label: 'Monthly', sub: 'Near-peak', h: 87 },
  { key: 'quarterly', label: 'Quarterly', sub: 'Some loss', h: 71 },
  { key: 'rarely', label: 'Rarely', sub: 'Real loss', h: 57 },
  { key: 'never', label: 'Never', sub: 'Heavy loss', h: 44 },
]

// Q7 — pick a bar. Taller = more energy kept. A clean little chart.
export default function CleaningQuestion({ value, onAnswer, onBack }: Props) {
  return (
    <Scene accent="var(--color-electric)" onBack={onBack}>
      <StepNumber n={7} className="absolute -right-3 -top-6 z-0 md:-right-5" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col justify-center px-5 pt-20 md:px-10 md:pt-0">
        <h2 className="mb-10 max-w-2xl font-display text-[10vw] font-semibold leading-[0.86] md:mb-14 md:text-[5vw]">
          <SplitText per="word" stagger={0.05}>How often will you clean the panels?</SplitText>
        </h2>

        <div className="flex items-end gap-2 md:gap-4">
          {OPTIONS.map((o, i) => {
            const selected = value === o.key
            return (
              <button
                key={o.key}
                data-cursor
                onClick={() => onAnswer(o.key)}
                className="group flex flex-1 flex-col items-center gap-3"
              >
                <div className="relative flex h-[34vh] w-full items-end border-2 border-ink bg-bone">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${o.h}%` }}
                    transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                    style={{ background: selected ? 'var(--color-electric)' : 'var(--color-ink)', opacity: selected ? 1 : 0.18 }}
                  />
                  <span className="absolute left-1/2 top-2 -translate-x-1/2 tnum text-[10px] font-medium text-ink-soft md:text-xs">
                    {o.h}%
                  </span>
                </div>
                <span className="font-display text-base leading-none transition-transform group-hover:-translate-y-0.5 md:text-2xl">
                  {o.label}
                </span>
                <span className="hidden text-[11px] uppercase tracking-wide text-ink-soft md:block">
                  {o.sub}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </Scene>
  )
}
