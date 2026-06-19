'use client'

import { useState } from 'react'
import type { Location } from '@/types'
import Scene from './Scene'
import SplitText from '@/components/primitives/SplitText'
import StepNumber from '@/components/primitives/StepNumber'
import ContinueButton from '@/components/primitives/ContinueButton'
import { HalfDisc } from '@/components/art/Shapes'

interface Props {
  value?: Location
  onAnswer: (v: Location) => void
  onBack?: () => void
}

const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'New Delhi', 'Chennai', 'Pune', 'Jaipur', 'Kochi']

// Q2 — left/right editorial spread with an electric-blue horizon.
export default function LocationQuestion({ value, onAnswer, onBack }: Props) {
  const [address, setAddress] = useState(value?.address ?? '')

  return (
    <Scene accent="var(--color-electric)" onBack={onBack}>
      {/* horizon */}
      <div className="anim-float pointer-events-none absolute -bottom-[18vw] left-1/2 h-[34vw] w-[60vw] -translate-x-1/2 opacity-90">
        <HalfDisc color="var(--color-electric)" />
      </div>
      <StepNumber n={2} className="absolute -bottom-8 right-2 z-0 md:right-6" />

      <div className="relative z-10 grid h-full grid-rows-[1fr_auto] gap-8 px-5 pt-24 md:grid-cols-2 md:grid-rows-1 md:items-center md:px-10 md:pt-0">
        <h2 className="font-display text-[15vw] font-semibold leading-[0.82] md:text-[8vw]">
          <SplitText stagger={0.03}>WHERE</SplitText>
          <br />
          <span className="text-hollow">
            <SplitText delay={0.2} stagger={0.03}>IS IT?</SplitText>
          </span>
        </h2>

        <div className="flex flex-col justify-center pb-28 md:pb-0">
          <label className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft">
            Your city or area
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Indiranagar, Bengaluru"
            className="w-full border-b-2 border-ink bg-transparent pb-3 font-display text-3xl outline-none placeholder:text-ink-soft/40 md:text-4xl"
          />

          <div className="mt-6 flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                data-cursor
                onClick={() => setAddress(c)}
                className={`border-2 border-ink px-3 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5 ${
                  address === c ? 'bg-electric text-paper' : 'bg-snow'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-10">
            <ContinueButton
              onClick={() => onAnswer({ address: address.trim() || 'Not specified' })}
            />
          </div>
        </div>
      </div>
    </Scene>
  )
}
