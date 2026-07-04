'use client'

import { motion } from 'framer-motion'
import type { SolarAnswers, SolarResults } from '@/types'
import { formatINR } from '@/lib/calculations'
import SplitText from '@/components/primitives/SplitText'
import CountUp from '@/components/primitives/CountUp'
import SmoothScroll from '@/components/chrome/SmoothScroll'
import ARViewer from './ARViewer'
import Image from 'next/image'
import { Burst, Disc } from '@/components/art/Shapes'

interface Props {
  results: SolarResults
  answers: SolarAnswers
  insights: string[]
  onRestart: () => void
}

const rupeesFull = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

function Metric({
  label,
  children,
  accent,
  className,
}: {
  label: string
  children: React.ReactNode
  accent?: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col justify-between border-ink p-6 md:p-8 ${className ?? ''}`}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink-soft">{label}</span>
      <span
        className="mt-10 font-display font-semibold leading-[0.85] tracking-tight"
        style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', color: accent }}
      >
        {children}
      </span>
    </motion.div>
  )
}

export default function ResultsScreen({ results, answers, insights, onRestart }: Props) {
  const co2Tonnes = (results.annualGenerationKwh * 0.71 * 25) / 1000

  return (
    <div className="relative w-full bg-paper">
      <SmoothScroll />

      {/* ---------- POSTER ---------- */}
      <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-16 pt-28 md:px-10">
        
        {/* LOGO */}
        <div className="absolute left-5 top-5 md:left-10 md:top-8 z-20 flex items-center">
          <Image src="/logo.png" alt="Ashwitha Energy Services" width={64} height={64} className="object-contain" priority />
        </div>

        <div className="anim-spin-slow pointer-events-none absolute -right-[20vw] -top-[20vw] h-[60vw] w-[60vw] opacity-[0.07]">
          <Burst color="var(--color-ink)" spokes={40} sw={1.4} />
        </div>
        <div className="anim-float pointer-events-none absolute bottom-[8vh] left-[6vw] hidden h-16 w-16 md:block">
          <Disc color="var(--color-solar)" />
        </div>

        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-ink-soft md:text-sm">
          Your estimate — {answers.location?.address ?? 'India'}
        </p>

        <h1 className="font-display font-semibold lede">
          <span className="block" style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)' }}>
            <SplitText per="word" stagger={0.05}>Your roof can save</SplitText>
          </span>
          <span className="my-2 block text-solar" style={{ fontSize: 'clamp(3.6rem, 17vw, 16rem)' }}>
            <CountUp value={results.savingsIn25YearsINR} format={rupeesFull} trigger="mount" duration={2.4} />
          </span>
          <span className="block" style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)' }}>
            <SplitText per="word" delay={0.4} stagger={0.05}>over 25 years.</SplitText>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 max-w-md text-sm text-ink-soft md:text-base"
        >
          Net of installation, after panel ageing and rising tariffs. Here is how it breaks down.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.2 }}
          className="mt-14 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-ink-soft"
        >
          Scroll
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.div>
      </section>

      {/* ---------- METRIC LEDGER ---------- */}
      <section className="px-5 pb-24 md:px-10">
        <div className="mb-8 flex items-end justify-between border-b-2 border-ink pb-4">
          <h2 className="font-display text-3xl font-semibold md:text-5xl">The numbers</h2>
          <span className="tnum text-[11px] uppercase tracking-[0.25em] text-ink-soft">
            {results.confidenceScore}% confidence
          </span>
        </div>

        <div className="grid grid-cols-1 border-l-2 border-t-2 border-ink md:grid-cols-12">
          <Metric label="Recommended system" accent="var(--color-electric)" className="border-b-2 border-r-2 md:col-span-6">
            <CountUp value={results.systemSizeKw} format={(n) => n.toFixed(1)} /> kW
          </Metric>
          <Metric label="Solar panels" className="border-b-2 border-r-2 md:col-span-6">
            <CountUp value={results.numPanels} /> panels
          </Metric>

          <Metric label="Generated each year" accent="var(--color-flame)" className="border-b-2 border-r-2 md:col-span-4">
            <CountUp value={results.annualGenerationKwh} format={(n) => Math.round(n).toLocaleString('en-IN')} />
            <span className="text-2xl text-ink-soft"> kWh</span>
          </Metric>
          <Metric label="Pays for itself in" accent="var(--color-violet)" className="border-b-2 border-r-2 md:col-span-4">
            <CountUp value={results.paybackPeriodYears} format={(n) => n.toFixed(1)} /> yrs
          </Metric>
          <Metric label="CO₂ avoided · 25 yrs" accent="var(--color-teal)" className="border-b-2 border-r-2 md:col-span-4">
            <CountUp value={co2Tonnes} format={(n) => n.toFixed(1)} />
            <span className="text-2xl text-ink-soft"> t</span>
          </Metric>

          <Metric label="Saved every month" accent="var(--color-solar)" className="border-b-2 border-r-2 md:col-span-7">
            <CountUp value={results.monthlySavingsINR} format={rupeesFull} />
          </Metric>
          <Metric label="Upfront investment" className="border-b-2 border-r-2 md:col-span-5">
            <CountUp value={results.installationCostINR} format={formatINR} />
          </Metric>
        </div>
      </section>

      {/* ---------- INSIGHTS ---------- */}
      {insights.length > 0 && (
        <section className="px-5 pb-28 md:px-10">
          <h2 className="mb-10 font-display text-3xl font-semibold md:text-5xl">
            <SplitText per="word" trigger="inView" stagger={0.05}>What this means for you</SplitText>
          </h2>
          <div className="grid gap-px bg-ink md:grid-cols-2">
            {insights.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-5 bg-paper p-7 md:p-9"
              >
                <span className="font-display text-3xl font-semibold leading-none text-solar md:text-4xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-base leading-relaxed md:text-lg">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- AR VIEWER ---------- */}
      <ARViewer onRestart={onRestart} />
    </div>
  )
}
