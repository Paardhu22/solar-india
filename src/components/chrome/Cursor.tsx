'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Additive editorial cursor: a hollow ring (lagging) + a solid dot (tight),
 * blended with difference so it reads over any color. Desktop fine-pointer only.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const [hidden, setHidden] = useState(true)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 360, damping: 28, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 360, damping: 28, mass: 0.5 })

  useEffect(() => {
    const fine =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine) return
    setEnabled(true)

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
      const el = e.target as HTMLElement
      setActive(!!el.closest('button, a, input, [role="slider"], [data-cursor]'))
    }
    const leave = () => setHidden(true)

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] mix-blend-difference"
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity 0.3s' }}
    >
      <motion.div
        className="absolute rounded-full border border-white"
        style={{ x: ringX, y: ringY, width: 40, height: 40, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: active ? 1.7 : 1, opacity: active ? 0.7 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      <motion.div
        className="absolute rounded-full bg-white"
        style={{ x, y, width: 6, height: 6, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: active ? 0 : 1 }}
      />
    </div>
  )
}
