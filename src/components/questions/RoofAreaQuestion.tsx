'use client'

import { useState } from 'react'
import Scene from './Scene'
import SplitText from '@/components/primitives/SplitText'
import NumberField from '@/components/primitives/NumberField'
import StepNumber from '@/components/primitives/StepNumber'
import ContinueButton from '@/components/primitives/ContinueButton'

interface Props {
  value?: number
  onAnswer: (v: number) => void
  onBack?: () => void
}

const MIN = 100
const MAX = 5000
const CELLS = 36

// Q4 — the roof grid fills up as you drag. Input becomes the artwork.
export default function RoofAreaQuestion({ value, onAnswer, onBack }: Props) {
  const [area, setArea] = useState(value ?? 1000)
  const filled = Math.round(((area - MIN) / (MAX - MIN)) * CELLS)

  return (
    <Scene accent="var(--color-teal)" onBack={onBack}>
      <StepNumber n={4} className="absolute -top-6 left-1/2 z-0 -translate-x-1/2" />

      <div className="relative z-10 grid h-full grid-rows-[auto_1fr] items-center gap-8 px-5 pt-24 md:grid-cols-2 md:grid-rows-1 md:px-10 md:pt-0">
        <div className="flex flex-col justify-center">
          <h2 className="mb-8 font-display text-[13vw] font-semibold leading-[0.84] md:text-[6vw]">
            <SplitText stagger={0.04}>ROOF</SplitText>
            <br />
            <span className="text-teal">
              <SplitText delay={0.16} stagger={0.04}>SPACE?</SplitText>
            </span>
          </h2>
          <NumberField
            value={area}
            onChange={setArea}
            min={MIN}
            max={MAX}
            step={50}
            suffix="sq ft"
            accent="var(--color-teal)"
            label="Available roof area"
          />
          <div className="mt-12">
            <ContinueButton onClick={() => onAnswer(area)} />
          </div>
        </div>

        {/* the roof, filling with panels */}
        <div className="hidden place-items-center md:grid">
          <div className="grid aspect-square w-[min(34vw,420px)] grid-cols-6 gap-1.5 border-2 border-ink p-2 shadow-ink">
            {Array.from({ length: CELLS }).map((_, i) => (
              <div
                key={i}
                className="aspect-square border border-ink/60 transition-colors duration-300"
                style={{ background: i < filled ? 'var(--color-teal)' : 'transparent' }}
              />
            ))}
          </div>
        </div>
      </div>
    </Scene>
  )
}
