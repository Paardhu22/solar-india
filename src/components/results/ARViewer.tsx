// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import SplitText from '@/components/primitives/SplitText'

// Register model-viewer as a JSX intrinsic element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src: string;
        iosSrc?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'shadow-intensity'?: string;
      }
    }
  }
}

interface Props {
  onRestart: () => void
}

export default function ARViewer({ onRestart }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Dynamically import @google/model-viewer only on the client side
    import('@google/model-viewer')
      .then(() => setIsMounted(true))
      .catch(console.error)
  }, [])

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center bg-paper px-5 py-24 text-center md:px-10">
      <h2 className="mb-6 max-w-2xl font-display text-[12vw] font-semibold leading-[0.85] tracking-tight md:text-[6vw]">
        <SplitText trigger="inView" stagger={0.05}>Will it fit?</SplitText>
      </h2>
      
      <p className="mb-14 max-w-lg text-sm text-ink-soft md:text-base">
        View a 3D solar panel in your physical space to see how it fits on your roof. Tap the button below on your smartphone to activate AR.
      </p>

      <div className="relative mb-16 aspect-square w-full max-w-[600px] overflow-hidden rounded-2xl bg-bone">
        {isMounted ? (
          // @ts-ignore
          <model-viewer
            src="/solar_panel.glb"
            alt="A realistic 3D model of a solar panel"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{ width: '100%', height: '100%', backgroundColor: '#E4E2DC' }}
          >
            <button
              slot="ar-button"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-electric px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper shadow-lg hover:bg-ink transition-colors md:px-8 md:py-4 md:text-sm"
            >
              View in your space
            </button>
          </model-viewer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-ink-soft">
            <span className="text-sm font-medium uppercase tracking-[0.2em]">Loading AR Module...</span>
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:text-electric"
      >
        Restart Estimator
      </button>
    </section>
  )
}
