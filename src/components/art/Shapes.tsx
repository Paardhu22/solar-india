/**
 * Flat, thick-outlined geometric primitives — the "paper-cut" vocabulary used
 * to art-direct every scene. Each scales to its parent box; color via props.
 */
import type { CSSProperties } from 'react'

interface ShapeProps {
  className?: string
  color?: string
  stroke?: string
  sw?: number
  style?: CSSProperties
}

const base = 'block h-full w-full overflow-visible'

export function Disc({ className, color = 'var(--color-solar)', stroke = 'var(--color-ink)', sw = 4 }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      <circle cx="50" cy="50" r={48 - sw / 2} fill={color} stroke={stroke} strokeWidth={sw} />
    </svg>
  )
}

export function Ring({ className, color = 'var(--color-ink)', sw = 4 }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      <circle cx="50" cy="50" r={48 - sw / 2} fill="none" stroke={color} strokeWidth={sw} />
    </svg>
  )
}

export function HalfDisc({ className, color = 'var(--color-electric)', stroke = 'var(--color-ink)', sw = 4 }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 50" className={`${base} ${className ?? ''}`}>
      <path d={`M ${sw / 2} 50 A ${50 - sw / 2} ${50 - sw / 2} 0 0 1 ${100 - sw / 2} 50 Z`} fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
}

export function Quarter({ className, color = 'var(--color-flame)', stroke = 'var(--color-ink)', sw = 4 }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      <path d={`M ${sw / 2} 100 L ${sw / 2} ${sw / 2} A ${100 - sw} ${100 - sw} 0 0 1 100 100 Z`} fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
}

export function Square({ className, color = 'var(--color-teal)', stroke = 'var(--color-ink)', sw = 4 }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      <rect x={sw / 2} y={sw / 2} width={100 - sw} height={100 - sw} fill={color} stroke={stroke} strokeWidth={sw} />
    </svg>
  )
}

export function Triangle({ className, color = 'var(--color-pink)', stroke = 'var(--color-ink)', sw = 4 }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      <path d="M50 6 L96 92 L4 92 Z" fill={color} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
}

/** Sunburst — radiating spokes. The only "solar" motif, kept abstract. */
export function Burst({ className, color = 'var(--color-ink)', sw = 3.5, spokes = 16 }: ShapeProps & { spokes?: number }) {
  const lines = Array.from({ length: spokes }, (_, i) => {
    const a = (i / spokes) * Math.PI * 2
    return {
      x1: 50 + Math.cos(a) * 20,
      y1: 50 + Math.sin(a) * 20,
      x2: 50 + Math.cos(a) * 49,
      y2: 50 + Math.sin(a) * 49,
    }
  })
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      ))}
    </svg>
  )
}

export function Plus({ className, color = 'var(--color-ink)', sw = 4 }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      <line x1="50" y1="8" x2="50" y2="92" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1="8" y1="50" x2="92" y2="50" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}

export function Wave({ className, color = 'var(--color-ink)', sw = 4 }: ShapeProps) {
  return (
    <svg viewBox="0 0 120 24" className={`${base} ${className ?? ''}`}>
      <path d="M2 12 Q 17 -2 32 12 T 62 12 T 92 12 T 122 12" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}

export function Stripes({ className, color = 'var(--color-ink)', sw = 5 }: ShapeProps) {
  const lines = Array.from({ length: 7 }, (_, i) => 6 + i * 14)
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      {lines.map((x, i) => (
        <line key={i} x1={x} y1="0" x2={x - 30} y2="100" stroke={color} strokeWidth={sw} />
      ))}
    </svg>
  )
}

/** Concentric arcs — radiant ripples. */
export function Arcs({ className, color = 'var(--color-ink)', sw = 3.5 }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" className={`${base} ${className ?? ''}`}>
      {[20, 33, 46].map((r, i) => (
        <path key={i} d={`M ${50 - r} 50 A ${r} ${r} 0 0 1 ${50 + r} 50`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      ))}
    </svg>
  )
}
