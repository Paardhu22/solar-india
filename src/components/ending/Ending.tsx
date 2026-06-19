'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import SplitText from '@/components/primitives/SplitText'
import { Disc, Ring, Burst, Triangle, HalfDisc } from '@/components/art/Shapes'

/** One full-height phrase that drifts as it passes through the viewport. */
function RevealLine({
  children,
  align = 'left',
  art,
}: {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  art?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['16%', '-16%'])

  const justify =
    align === 'center' ? 'items-center text-center' : align === 'right' ? 'items-end text-right' : 'items-start text-left'

  return (
    <section ref={ref} className="relative flex min-h-[78svh] flex-col justify-center overflow-hidden px-5 md:px-10">
      {art}
      <motion.h2
        style={{ y }}
        className={`relative z-10 flex flex-col font-display font-semibold leading-[0.82] tracking-tight ${justify}`}
      >
        {children}
      </motion.h2>
    </section>
  )
}

const Line = ({ children, accent }: { children: string; accent?: string }) => (
  <span className="block" style={{ fontSize: 'clamp(3rem, 13vw, 13rem)', color: accent }}>
    <SplitText trigger="inView" stagger={0.04} duration={0.9}>
      {children}
    </SplitText>
  </span>
)

export default function Ending({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="relative w-full bg-paper">
      {/* ---- cinematic reveals ---- */}
      <RevealLine
        align="left"
        art={
          <div className="anim-float pointer-events-none absolute right-[8vw] top-[16vh] hidden h-[16vw] w-[16vw] md:block">
            <Disc color="var(--color-solar)" />
          </div>
        }
      >
        <Line>BUILD</Line>
        <Line>YOUR</Line>
        <Line accent="var(--color-flame)">FUTURE</Line>
      </RevealLine>

      <RevealLine
        align="right"
        art={
          <div className="anim-spin-slow pointer-events-none absolute left-[6vw] top-[20vh] hidden h-[20vw] w-[20vw] opacity-30 md:block">
            <Burst color="var(--color-ink)" spokes={24} />
          </div>
        }
      >
        <Line>POWER</Line>
        <Line accent="var(--color-electric)">YOUR HOME</Line>
      </RevealLine>

      <RevealLine
        align="left"
        art={
          <>
            <div className="pointer-events-none absolute bottom-[14vh] right-[12vw] hidden h-24 w-48 md:block">
              <HalfDisc color="var(--color-teal)" />
            </div>
            <div className="anim-drift pointer-events-none absolute right-[30vw] top-[18vh] hidden h-16 w-16 md:block">
              <Triangle color="var(--color-pink)" />
            </div>
          </>
        }
      >
        <Line>DESIGNED</Line>
        <Line>FOR YOUR</Line>
        <Line accent="var(--color-violet)">ROOF</Line>
      </RevealLine>

      {/* ---- brand fills the screen ---- */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
        <div className="anim-spin-slow pointer-events-none absolute h-[150vmin] w-[150vmin] opacity-[0.05]">
          <Burst color="var(--color-ink)" spokes={72} sw={1} />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-5 text-[11px] font-medium uppercase tracking-[0.4em] text-ink-soft md:mb-8 md:text-sm"
        >
          Powered by
        </motion.p>
        <h2 className="relative z-10 font-display font-semibold leading-[0.8] tracking-tight">
          <span className="block" style={{ fontSize: 'clamp(3.4rem, 15vw, 15rem)' }}>
            <SplitText trigger="inView" stagger={0.05} duration={1}>ASHWITHA</SplitText>
          </span>
          <span className="block text-solar" style={{ fontSize: 'clamp(2.4rem, 10.5vw, 10.5rem)' }}>
            <SplitText trigger="inView" delay={0.25} stagger={0.05} duration={1}>ENERGY</SplitText>
          </span>
          <span className="block text-hollow" style={{ fontSize: 'clamp(2.4rem, 10.5vw, 10.5rem)' }}>
            <SplitText trigger="inView" delay={0.45} stagger={0.05} duration={1}>SERVICES</SplitText>
          </span>
        </h2>
      </section>

      {/* ---- CTA ---- */}
      <section className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden border-y-2 border-ink px-5 text-center">
        <div className="anim-float pointer-events-none absolute left-[10vw] top-[18vh] hidden h-20 w-20 md:block">
          <Ring color="var(--color-flame)" sw={6} />
        </div>
        <p className="mb-6 max-w-md text-base text-ink-soft md:text-lg">
          Ready to see it on your actual roof? A specialist visits, measures, and quotes — free.
        </p>
        <motion.a
          href="mailto:hello@ashwithaenergy.in?subject=Free%20rooftop%20solar%20site%20visit"
          data-cursor
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          className="group flex flex-col items-center font-display font-semibold leading-[0.82] tracking-tight"
        >
          <span style={{ fontSize: 'clamp(3rem, 13vw, 12rem)' }}>BOOK A FREE</span>
          <span className="flex items-center gap-5" style={{ fontSize: 'clamp(3rem, 13vw, 12rem)' }}>
            SITE VISIT
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:rotate-45 md:h-24 md:w-24">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </span>
        </motion.a>
      </section>

      <Footer onRestart={onRestart} />
    </div>
  )
}

function Footer({ onRestart }: { onRestart: () => void }) {
  return (
    <footer className="bg-paper px-5 pb-10 pt-20 md:px-10">
      <h3 className="font-display font-semibold leading-[0.82] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 9vw, 9rem)' }}>
        ASHWITHA ENERGY
        <br />
        <span className="text-hollow">SERVICES</span>
      </h3>

      <div className="mt-16 grid grid-cols-2 gap-10 border-t-2 border-ink pt-10 md:grid-cols-4">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft">Visit</p>
          <p className="text-sm leading-relaxed">Rooftop solar across India — homes, housing societies & SMEs.</p>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft">Talk</p>
          <a href="mailto:hello@ashwithaenergy.in" className="block text-sm hover:text-electric">hello@ashwithaenergy.in</a>
          <a href="tel:+910000000000" className="block text-sm hover:text-electric">+91 00000 00000</a>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft">Follow</p>
          <a href="#" className="block text-sm hover:text-electric">Instagram</a>
          <a href="#" className="block text-sm hover:text-electric">LinkedIn</a>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft">Again?</p>
          <button onClick={onRestart} data-cursor className="group flex items-center gap-2 text-sm">
            <span className="inline-block transition-transform group-hover:-rotate-180">↺</span>
            Start a new estimate
          </button>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-2 border-t border-ink/20 pt-6 text-[11px] uppercase tracking-[0.2em] text-ink-soft md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} Ashwitha Energy Services</span>
        <span>Solar Estimator — an interactive experience</span>
      </div>
    </footer>
  )
}
