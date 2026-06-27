'use client'

import { useState } from 'react'
import Scene from './Scene'
import SplitText from '@/components/primitives/SplitText'
import NumberField from '@/components/primitives/NumberField'
import StepNumber from '@/components/primitives/StepNumber'
import ContinueButton from '@/components/primitives/ContinueButton'
import { Burst } from '@/components/art/Shapes'

interface Props {
  value?: number
  onAnswer: (v: number) => void
  onBack?: () => void
}

// Q1 — the number sits inside the sun. Centered.
export default function BillQuestion({ value, onAnswer, onBack }: Props) {
  const [bill, setBill] = useState<number | ''>(value ?? '')

  return (
    <Scene accent="var(--color-solar)" onBack={onBack}>
      <div className="anim-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]">
        <Burst color="var(--color-ink)" spokes={56} sw={1.4} />
      </div>
      <StepNumber n={1} className="absolute -left-3 -top-5 z-0 md:-left-5 md:-top-8" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center md:px-10">
        <h2 className="mb-12 max-w-3xl font-display text-3xl font-semibold leading-[0.95] md:mb-16 md:text-5xl">
          <SplitText per="word" stagger={0.07}>
            What do you pay for power each month?
          </SplitText>
        </h2>

        <NumberField
          value={bill}
          onChange={setBill}
          onEnter={() => bill !== '' && bill >= 500 && onAnswer(bill)}
          min={500}
          max={50000}
          step={100}
          prefix="₹"
          suffix="/mo"
          accent="var(--color-solar)"
          label="Monthly electricity bill"
          hideControls
        />

        <div className="mt-16 md:mt-20">
          <ContinueButton onClick={() => onAnswer(bill as number)} disabled={bill === '' || bill < 500} />
        </div>
      </div>
    </Scene>
  )
}
