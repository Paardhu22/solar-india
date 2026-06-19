'use client'

import type { WeatherType } from '@/types'
import Scene from './Scene'
import SplitText from '@/components/primitives/SplitText'
import StepNumber from '@/components/primitives/StepNumber'
import OptionCard from '@/components/primitives/OptionCard'
import { Burst } from '@/components/art/Shapes'

interface Props {
  value?: WeatherType
  onAnswer: (v: WeatherType) => void
  onBack?: () => void
}

const OPTIONS: { key: WeatherType; label: string; caption: string; tag: string }[] = [
  { key: 'sunny', label: 'Mostly Sunny', caption: 'Clear skies for most of the year', tag: '5.5h sun' },
  { key: 'moderate', label: 'Moderate', caption: 'A balanced mix of sun and cloud', tag: '4.5h sun' },
  { key: 'cloudy', label: 'Often Cloudy', caption: 'Frequently overcast days', tag: '3.5h sun' },
  { key: 'rainfall', label: 'Heavy Rainfall', caption: 'Long monsoon, low direct sun', tag: '2.8h sun' },
]

// Q3 — split: title + rotating rays left, choices stacked right.
export default function WeatherQuestion({ value, onAnswer, onBack }: Props) {
  return (
    <Scene accent="var(--color-flame)" onBack={onBack}>
      <div className="anim-spin-slow pointer-events-none absolute -left-[14vw] top-1/2 h-[44vw] w-[44vw] -translate-y-1/2 opacity-10">
        <Burst color="var(--color-flame)" spokes={28} sw={2} />
      </div>

      <div className="relative z-10 grid h-full grid-rows-[auto_1fr] gap-6 px-5 pt-24 md:grid-cols-[1fr_minmax(360px,46%)] md:grid-rows-1 md:items-center md:px-10 md:pt-0">
        <div className="relative">
          <StepNumber n={3} className="absolute -top-16 left-0 -z-0 hidden md:block" />
          <h2 className="relative font-display text-[14vw] font-semibold leading-[0.84] md:text-[6.5vw]">
            <SplitText stagger={0.04}>HOW MUCH</SplitText>
            <br />
            <span className="text-flame">
              <SplitText delay={0.18} stagger={0.04}>SUN?</SplitText>
            </span>
          </h2>
          <p className="mt-4 max-w-xs text-sm text-ink-soft">
            Sunshine hours decide how much energy your panels make.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 pb-10 md:pb-0">
          {OPTIONS.map((o, i) => (
            <OptionCard
              key={o.key}
              index={i}
              label={o.label}
              caption={o.caption}
              tag={o.tag}
              selected={value === o.key}
              accent="var(--color-flame)"
              onSelect={() => onAnswer(o.key)}
            />
          ))}
        </div>
      </div>
    </Scene>
  )
}
