'use client'

import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { Burst, Ring } from '@/components/art/Shapes'

const PHRASES = [
  'Calculating',
  'Checking Solar Irradiance',
  'Estimating Roof Utilisation',
  'Calculating ROI',
  'Analysing Weather Data',
]

const EACH = 0.96 // seconds per phrase; total ~4.8s, just under the 5.2s switch

/** A film-title sequence in kinetic type. GSAP-choreographed. */
export default function LoadingScreen() {
  const root = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      const total = PHRASES.length * EACH

      gsap.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: total, ease: 'none' })

      const counter = { v: 0 }
      gsap.to(counter, {
        v: 100,
        duration: total,
        ease: 'none',
        onUpdate: () => {
          if (pctRef.current) pctRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        },
      })

      const tl = gsap.timeline()
      PHRASES.forEach((_, i) => {
        const words = root.current!.querySelectorAll<HTMLElement>(`[data-phrase="${i}"] .w`)
        const at = i * EACH
        if (reduce) {
          tl.fromTo(words, { opacity: 0 }, { opacity: 1, duration: 0.3 }, at)
          tl.to(words, { opacity: 0, duration: 0.2 }, at + EACH - 0.25)
        } else {
          tl.fromTo(
            words,
            { yPercent: 120, opacity: 0, rotate: 5 },
            { yPercent: 0, opacity: 1, rotate: 0, stagger: 0.05, duration: 0.5, ease: 'power3.out' },
            at,
          )
          tl.to(words, { yPercent: -120, opacity: 0, duration: 0.36, ease: 'power2.in', stagger: 0.03 }, at + EACH - 0.32)
        }
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="relative grid h-[100svh] w-full place-items-center overflow-hidden bg-paper px-6">
      <div className="anim-spin-slow pointer-events-none absolute h-[120vmin] w-[120vmin] opacity-[0.05]">
        <Burst color="var(--color-ink)" spokes={64} sw={1.2} />
      </div>
      <div className="anim-spin-rev pointer-events-none absolute h-[58vmin] w-[58vmin] opacity-20">
        <Ring color="var(--color-solar)" sw={1.5} />
      </div>

      <div className="relative grid place-items-center text-center">
        {PHRASES.map((p, i) => (
          <h2
            key={i}
            data-phrase={i}
            className="col-start-1 row-start-1 max-w-5xl font-display font-semibold leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 8vw, 7rem)' }}
          >
            {p.split(' ').map((word, wi) => (
              <span key={wi} className="mx-[0.18em] inline-block overflow-hidden align-bottom">
                <span className="w inline-block">{word}</span>
              </span>
            ))}
          </h2>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 md:px-10 md:pb-10">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink-soft">
            Building your estimate
          </span>
          <span className="tnum font-display text-2xl md:text-4xl">
            <span ref={pctRef}>000</span>
            <span className="text-ink-soft">%</span>
          </span>
        </div>
        <div className="h-1.5 w-full bg-ink/10">
          <div ref={barRef} className="h-full w-full origin-left bg-ink" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </div>
  )
}
