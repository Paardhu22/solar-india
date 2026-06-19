'use client'

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef } from 'react'

interface CountUpProps {
  value: number
  format?: (n: number) => string
  duration?: number
  delay?: number
  start?: number
  className?: string
  trigger?: 'mount' | 'inView'
}

/** Counts a number up to `value` when it enters the viewport (or on mount). */
export default function CountUp({
  value,
  format,
  duration = 1.8,
  delay = 0,
  start = 0,
  className,
  trigger = 'inView',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const count = useMotionValue(start)
  const display = useTransform(count, (v) =>
    format ? format(v) : Math.round(v).toLocaleString('en-IN'),
  )

  const active = trigger === 'mount' || inView

  useEffect(() => {
    if (!active) return
    if (reduce) {
      count.set(value)
      return
    }
    const controls = animate(count, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, value])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}
