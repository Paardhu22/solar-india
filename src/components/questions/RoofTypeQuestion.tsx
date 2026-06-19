'use client'

import type { RoofType } from '@/types'
import Scene from './Scene'
import SplitText from '@/components/primitives/SplitText'
import StepNumber from '@/components/primitives/StepNumber'
import OptionCard from '@/components/primitives/OptionCard'
import { Square, Stripes, Triangle, HalfDisc } from '@/components/art/Shapes'

interface Props {
  value?: RoofType
  onAnswer: (v: RoofType) => void
  onBack?: () => void
}

const V = 'var(--color-violet)'
const OPTIONS: { key: RoofType; label: string; caption: string; glyph: React.ReactNode }[] = [
  { key: 'rcc', label: 'RCC', caption: 'Flat concrete roof', glyph: <Square color={V} /> },
  { key: 'metal', label: 'Metal', caption: 'Sloped tin or sheet', glyph: <Stripes color={V} /> },
  { key: 'tile', label: 'Tiled', caption: 'Clay or concrete tiles', glyph: <Triangle color={V} /> },
  { key: 'ground', label: 'Ground', caption: 'Open land mount', glyph: <HalfDisc color={V} /> },
]

// Q5 — a 2×2 grid of material blocks.
export default function RoofTypeQuestion({ value, onAnswer, onBack }: Props) {
  return (
    <Scene accent={V} onBack={onBack}>
      <StepNumber n={5} className="absolute -right-3 -top-6 z-0 md:-right-5" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col justify-center px-5 pt-20 md:px-10 md:pt-0">
        <h2 className="mb-8 font-display text-[12vw] font-semibold leading-[0.86] md:mb-12 md:text-[6vw]">
          <SplitText per="word" stagger={0.05}>What kind of roof?</SplitText>
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OPTIONS.map((o, i) => (
            <OptionCard
              key={o.key}
              index={i}
              label={o.label}
              caption={o.caption}
              glyph={o.glyph}
              selected={value === o.key}
              accent={V}
              onSelect={() => onAnswer(o.key)}
              className="py-6"
            />
          ))}
        </div>
      </div>
    </Scene>
  )
}
