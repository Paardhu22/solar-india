'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { type ReactNode } from 'react'
import SplitText from '@/components/primitives/SplitText'
import MagneticButton from '@/components/primitives/MagneticButton'
import { Disc, Ring, Burst, Square, Triangle, HalfDisc, Plus, Arcs } from '@/components/art/Shapes'

/** A parallax layer that leans with the pointer. depth ~ -1..1. */
function Floaty({
  px,
  py,
  depth,
  className,
  children,
}: {
  px: MotionValue<number>
  py: MotionValue<number>
  depth: number
  className?: string
  children: ReactNode
}) {
  const x = useTransform(px, (v) => v * depth)
  const y = useTransform(py, (v) => v * depth)
  return (
    <motion.div style={{ x, y }} className={className} aria-hidden>
      {children}
    </motion.div>
  )
}

export default function Hero({ onBegin }: { onBegin: () => void }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 60, damping: 18 })
  const py = useSpring(my, { stiffness: 60, damping: 18 })

  function onMove(e: React.MouseEvent) {
    if (reduce) return
    const { innerWidth, innerHeight } = window
    mx.set((e.clientX / innerWidth - 0.5) * 60)
    my.set((e.clientY / innerHeight - 0.5) * 60)
  }

  return (
    <section
      onMouseMove={onMove}
      className="relative h-[100svh] w-full overflow-hidden bg-paper"
    >
      {/* faint grid bed */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />

      {/* ---- abstract paper-cut artwork ---- */}
      <Floaty px={px} py={py} depth={0.9} className="absolute right-[6vw] top-[14vh] h-[20vw] max-h-52 min-h-28 w-[20vw] min-w-28 max-w-52">
        <div className="anim-spin-slow h-full w-full">
          <Burst color="var(--color-ink)" spokes={20} />
        </div>
      </Floaty>

      <Floaty px={px} py={py} depth={1.5} className="absolute left-[7vw] top-[18vh] h-[9vw] min-h-14 w-[9vw] min-w-14">
        <div className="anim-float h-full w-full">
          <Disc color="var(--color-solar)" />
        </div>
      </Floaty>

      <Floaty px={px} py={py} depth={-1.1} className="absolute bottom-[20vh] right-[12vw] hidden h-[7vw] w-[7vw] md:block">
        <div className="anim-drift h-full w-full">
          <Triangle color="var(--color-pink)" />
        </div>
      </Floaty>

      <Floaty px={px} py={py} depth={0.6} className="absolute bottom-[15vh] left-[44vw] hidden h-[6.5vw] w-[6.5vw] rotate-12 md:block">
        <Square color="var(--color-teal)" />
      </Floaty>

      <Floaty px={px} py={py} depth={-0.7} className="absolute right-[26vw] top-[8vh] hidden h-16 w-32 md:block">
        <HalfDisc color="var(--color-electric)" />
      </Floaty>

      <Floaty px={px} py={py} depth={1.2} className="absolute bottom-[28vh] left-[40vw] hidden h-12 w-12 md:block">
        <Ring color="var(--color-flame)" sw={6} />
      </Floaty>

      <Floaty px={px} py={py} depth={2} className="absolute left-[48vw] top-[16vh] hidden h-10 w-10 md:block">
        <Plus color="var(--color-violet)" sw={6} />
      </Floaty>

      <Floaty px={px} py={py} depth={-0.5} className="absolute bottom-[8vh] right-[30vw] hidden h-16 w-28 opacity-80 md:block">
        <Arcs color="var(--color-ink)" />
      </Floaty>

      {/* ---- type lockup ---- */}
      <div className="relative z-10 flex h-full flex-col justify-center px-5 md:px-10">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-3 text-[11px] font-medium uppercase tracking-[0.4em] text-ink-soft md:mb-5 md:text-sm"
        >
          Ashwitha Energy Services — India
        </motion.p>

        <h1 className="lede font-display font-semibold">
          <span className="block" style={{ fontSize: 'clamp(4.5rem, 23vw, 21rem)' }}>
            <SplitText stagger={0.04} duration={1}>SOLAR</SplitText>
          </span>
          <span
            className="block text-hollow"
            style={{ fontSize: 'clamp(2.7rem, 13.6vw, 12.5rem)' }}
          >
            <SplitText delay={0.25} stagger={0.035} duration={1}>
              ESTIMATOR
            </SplitText>
          </span>
        </h1>

        {/* meta + integrated CTA */}
        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-xs text-sm leading-relaxed text-ink-soft md:text-base"
          >
            Answer eight questions. Watch your roof turn into decades of savings.
            No jargon. No dashboards.
          </motion.p>

          <MagneticButton
            onClick={onBegin}
            strength={0.5}
            aria-label="Begin the estimate"
            className="self-start md:self-auto"
          >
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-end gap-4"
            >
              <span className="font-display font-semibold leading-[0.8] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
                BEGIN
              </span>
              <span className="mb-2 grid h-14 w-14 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:rotate-45 md:h-20 md:w-20">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </motion.span>
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
