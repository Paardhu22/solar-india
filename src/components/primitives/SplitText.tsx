'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useMemo } from 'react'
import { cn } from '@/lib/cn'

interface SplitTextProps {
  children: string
  per?: 'char' | 'word' | 'line'
  className?: string
  itemClassName?: string
  delay?: number
  stagger?: number
  duration?: number
  y?: string | number
  rotate?: number
  trigger?: 'mount' | 'inView'
  once?: boolean
}

/**
 * Kinetic type: splits a string into masked chars/words/lines that rise into
 * place with a staggered overshoot. Honors prefers-reduced-motion.
 */
export default function SplitText({
  children,
  per = 'char',
  className,
  itemClassName,
  delay = 0,
  stagger = 0.026,
  duration = 0.9,
  y = '110%',
  rotate = 0,
  trigger = 'mount',
  once = true,
}: SplitTextProps) {
  const reduce = useReducedMotion()

  const tokens = useMemo(() => {
    if (per === 'line') return children.split('\n')
    return children.split(' ')
  }, [children, per])

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
    },
  }

  const item: Variants = {
    hidden: { y: reduce ? 0 : y, rotate: reduce ? 0 : rotate, opacity: reduce ? 1 : 0 },
    visible: {
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: { duration: reduce ? 0 : duration, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const motionProps =
    trigger === 'inView'
      ? { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: { once, amount: 0.4 } }
      : { initial: 'hidden' as const, animate: 'visible' as const }

  return (
    <motion.span className={cn('inline-block', className)} variants={container} {...motionProps}>
      {per === 'char'
        ? tokens.map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} className="inline-block overflow-hidden align-bottom">
                  <motion.span className={cn('inline-block', itemClassName)} variants={item}>
                    {ch}
                  </motion.span>
                </span>
              ))}
              {wi < tokens.length - 1 && <span className="inline-block">{' '}</span>}
            </span>
          ))
        : tokens.map((tok, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span className={cn('inline-block', itemClassName)} variants={item}>
                {tok}
                {per === 'word' && i < tokens.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
    </motion.span>
  )
}
