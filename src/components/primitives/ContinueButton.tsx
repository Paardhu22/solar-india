'use client'

import MagneticButton from './MagneticButton'

interface ContinueButtonProps {
  onClick: () => void
  label?: string
  disabled?: boolean
}

/** The forward control for value questions — typographic, not a pill. */
export default function ContinueButton({ onClick, label = 'Continue', disabled }: ContinueButtonProps) {
  return (
    <MagneticButton onClick={onClick} disabled={disabled} strength={0.4} aria-label={label}>
      <span className="group flex items-center gap-3 disabled:opacity-40" style={{ opacity: disabled ? 0.4 : 1 }}>
        <span className="font-display font-semibold leading-none tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
          {label}
        </span>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-hover:translate-x-1 md:h-16 md:w-16">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </MagneticButton>
  )
}
