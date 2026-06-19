'use client'

import type { ShadingType } from '@/types'
import Scene from './Scene'
import SplitText from '@/components/primitives/SplitText'
import StepNumber from '@/components/primitives/StepNumber'
import OptionCard from '@/components/primitives/OptionCard'
import { Disc } from '@/components/art/Shapes'

interface Props {
  value?: ShadingType
  onAnswer: (v: ShadingType) => void
  onBack?: () => void
}

const OPTIONS: { key: ShadingType; label: string; caption: string }[] = [
  { key: 'none', label: 'None', caption: 'Open roof, full sun all day' },
  { key: 'trees', label: 'Trees', caption: 'Branches cross the roof' },
  { key: 'buildings', label: 'Buildings', caption: 'Neighbours block the light' },
  { key: 'water_tank', label: 'Water Tank', caption: 'A tank casts a shadow' },
  { key: 'heavy', label: 'Heavy Shade', caption: 'Shaded most of the day' },
]

// Q6 — a sun eclipsed by a hard-edged shadow.
export default function ShadingQuestion({ value, onAnswer, onBack }: Props) {
  return (
    <Scene accent="var(--color-pink)" onBack={onBack}>
      {/* sun + shadow */}
      <div className="pointer-events-none absolute -left-[10vw] top-[8vh] h-[40vw] w-[40vw] opacity-95">
        <div className="anim-float h-full w-full">
          <Disc color="var(--color-solar)" />
        </div>
      </div>
      <div className="pointer-events-none absolute left-[6vw] top-[20vh] h-[34vw] w-[34vw] bg-ink opacity-90 mix-blend-multiply" />

      <StepNumber n={6} className="absolute -bottom-8 left-2 z-0 md:left-8" />

      <div className="relative z-10 ml-auto grid h-full w-full max-w-2xl grid-rows-[auto_1fr] gap-6 px-5 pt-24 md:items-center md:px-10 md:pt-0">
        <h2 className="text-right font-display text-[14vw] font-semibold leading-[0.84] md:text-[7vw]">
          <SplitText stagger={0.04}>SHADOW</SplitText>
          <br />
          <span className="text-hollow">
            <SplitText delay={0.18} stagger={0.04}>LEVEL?</SplitText>
          </span>
        </h2>

        <div className="flex flex-col justify-center gap-2.5 pb-10 md:pb-0">
          {OPTIONS.map((o, i) => (
            <OptionCard
              key={o.key}
              index={i}
              label={o.label}
              caption={o.caption}
              selected={value === o.key}
              accent="var(--color-pink)"
              onSelect={() => onAnswer(o.key)}
            />
          ))}
        </div>
      </div>
    </Scene>
  )
}
