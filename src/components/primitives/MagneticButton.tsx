'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/cn'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  strength?: number
  type?: 'button' | 'submit'
  'aria-label'?: string
  disabled?: boolean
}

/** A button that elastically leans toward the cursor. Desktop only; static under reduced-motion. */
export default function MagneticButton({
  children,
  className,
  onClick,
  strength = 0.4,
  type = 'button',
  disabled,
  ...rest
}: MagneticButtonProps) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 14, mass: 0.4 })
  const y = useSpring(my, { stiffness: 220, damping: 14, mass: 0.4 })

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    my.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function reset() {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.button
      type={type}
      data-cursor="magnetic"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      disabled={disabled}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={cn('relative inline-flex select-none items-center justify-center', className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
