'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface OptionCardProps {
  label: string
  caption?: string
  selected?: boolean
  onSelect: () => void
  accent?: string
  tag?: string
  glyph?: ReactNode
  className?: string
  index?: number
}

/** A tactile, thick-outlined selectable block. Lifts on hover, presses when chosen. */
export default function OptionCard({
  label,
  caption,
  selected,
  onSelect,
  accent = 'var(--color-solar)',
  tag,
  glyph,
  className,
  index = 0,
}: OptionCardProps) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      data-cursor
      onClick={onSelect}
      aria-pressed={selected}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.04 * index, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { x: -4, y: -4 }}
      whileTap={{ x: 0, y: 0 }}
      className={cn(
        'group relative flex w-full items-center gap-4 border-2 border-ink px-5 py-4 text-left transition-shadow duration-200',
        selected ? 'shadow-[2px_2px_0_0_var(--color-ink)]' : 'shadow-ink-sm hover:shadow-ink',
        className,
      )}
      style={{ background: selected ? accent : 'var(--color-snow)' }}
    >
      {glyph && (
        <span className="relative h-9 w-9 shrink-0 md:h-11 md:w-11" aria-hidden>
          {glyph}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-2xl leading-none tracking-tight md:text-3xl">
          {label}
        </span>
        {caption && (
          <span className="mt-1.5 block text-[13px] leading-snug text-ink-soft">{caption}</span>
        )}
      </span>
      {tag && (
        <span className="shrink-0 tnum text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
          {tag}
        </span>
      )}
    </motion.button>
  )
}
