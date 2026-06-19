'use client'

import { useId } from 'react'
import { cn } from '@/lib/cn'

interface NumberFieldProps {
  value: number
  onChange: (n: number) => void
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
  accent?: string
  className?: string
  label?: string
}

/** A giant, directly-editable number with a chunky slider. The input IS the headline. */
export default function NumberField({
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  accent = 'var(--color-solar)',
  className,
  label,
}: NumberFieldProps) {
  const id = useId()
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const digits = String(value).length

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-end justify-center gap-1 md:gap-2">
        {prefix && (
          <span className="font-display text-4xl leading-none text-ink-soft md:text-6xl">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          aria-label={label}
          value={value.toLocaleString('en-IN')}
          onChange={(e) => {
            const raw = Number(e.target.value.replace(/[^0-9]/g, ''))
            if (!Number.isNaN(raw)) onChange(clamp(raw))
          }}
          className="bg-transparent text-center font-display font-semibold leading-[0.8] tracking-tight outline-none caret-[var(--accent)]"
          style={
            {
              '--accent': accent,
              width: `${Math.max(digits, 1) + 0.5}ch`,
              fontSize: 'clamp(4rem, 16vw, 11rem)',
            } as React.CSSProperties
          }
        />
        {suffix && (
          <span className="mb-2 font-display text-xl leading-none text-ink-soft md:mb-4 md:text-3xl">
            {suffix}
          </span>
        )}
      </div>

      <div className="mx-auto mt-10 flex max-w-xl items-center gap-4">
        <button
          type="button"
          data-cursor
          aria-label="decrease"
          onClick={() => onChange(clamp(value - step))}
          className="grid h-11 w-11 shrink-0 place-items-center border-2 border-ink text-2xl leading-none shadow-ink-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          −
        </button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <button
          type="button"
          data-cursor
          aria-label="increase"
          onClick={() => onChange(clamp(value + step))}
          className="grid h-11 w-11 shrink-0 place-items-center border-2 border-ink text-2xl leading-none shadow-ink-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
          style={{ background: accent }}
        >
          +
        </button>
      </div>
    </div>
  )
}
