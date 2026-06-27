// @ts-nocheck
'use client'

import { useEffect, useState, useRef } from 'react'
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
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    import('@google/model-viewer')
      .then(() => setIsMounted(true))
      .catch(console.error)

    // Cleanup camera on unmount
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
      alert("Could not access your camera. Please ensure permissions are granted.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center bg-paper px-5 py-24 text-center md:px-10">
      <h2 className="mb-6 max-w-2xl font-display text-[12vw] font-semibold leading-[0.85] tracking-tight md:text-[6vw]">
        <SplitText trigger="inView" stagger={0.05}>Will it fit?</SplitText>
      </h2>
      
      <p className="mb-14 max-w-lg text-sm text-ink-soft md:text-base">
        View a 3D solar panel in your physical space. Use the AR button on mobile, or activate your webcam below.
      </p>

      <div className={`relative mb-16 aspect-square w-full max-w-[600px] overflow-hidden rounded-2xl ${cameraActive ? 'bg-black' : 'bg-bone'}`}>
        {/* Webcam Background */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* 3D Model Viewer */}
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
            style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: cameraActive ? 'transparent' : '#E4E2DC' 
            }}
          >
            <button
              slot="ar-button"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-electric px-6 py-3 text-xs font-semibold uppercase tracking-widest text-paper shadow-lg hover:bg-ink transition-colors md:px-8 md:py-4 md:text-sm"
            >
              View in AR
            </button>
          </model-viewer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-ink-soft">
            <span className="text-sm font-medium uppercase tracking-[0.2em]">Loading AR Module...</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 items-center mb-8">
        <button
          onClick={cameraActive ? stopCamera : startCamera}
          className="rounded-full border-2 border-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {cameraActive ? "Turn Off Webcam" : "Turn On Webcam"}
        </button>
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
