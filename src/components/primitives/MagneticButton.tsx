'use client'

import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
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
  return (
    <motion.button
      type={type}
      data-cursor="magnetic"
      onClick={onClick}
      disabled={disabled}
      className={cn('relative inline-flex select-none items-center justify-center', className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
