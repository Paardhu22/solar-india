'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useSolarEstimator } from '@/hooks/useSolarEstimator'
import Cursor from '@/components/chrome/Cursor'
import GrainOverlay from '@/components/chrome/GrainOverlay'
import Navigation from '@/components/chrome/Navigation'
import Hero from '@/components/hero/Hero'
import LoadingScreen from '@/components/loading/LoadingScreen'
import ResultsScreen from '@/components/results/ResultsScreen'
import BillQuestion from '@/components/questions/BillQuestion'
import LocationQuestion from '@/components/questions/LocationQuestion'
import WeatherQuestion from '@/components/questions/WeatherQuestion'
import RoofAreaQuestion from '@/components/questions/RoofAreaQuestion'
import RoofTypeQuestion from '@/components/questions/RoofTypeQuestion'
import ShadingQuestion from '@/components/questions/ShadingQuestion'
import CleaningQuestion from '@/components/questions/CleaningQuestion'
import FutureUsageQuestion from '@/components/questions/FutureUsageQuestion'

export default function Home() {
  const s = useSolarEstimator()
  const { phase, activeQuestion, answers, results, insights } = s

  // Lock document scroll everywhere except the scrollable results phase.
  useEffect(() => {
    document.body.dataset.lock = phase === 'results' ? 'false' : 'true'
    return () => {
      document.body.dataset.lock = 'false'
    }
  }, [phase])

  const back = activeQuestion > 0 ? s.goBack : undefined

  function renderQuestion() {
    switch (activeQuestion) {
      case 0:
        return <BillQuestion key={0} value={answers.monthlyBill} onAnswer={(v) => s.handleAnswer('monthlyBill', v)} onBack={back} />
      case 1:
        return <LocationQuestion key={1} value={answers.location} onAnswer={(v) => s.handleAnswer('location', v)} onBack={back} />
      case 2:
        return <WeatherQuestion key={2} value={answers.weather} onAnswer={(v) => s.handleAnswer('weather', v)} onBack={back} />
      case 3:
        return <RoofAreaQuestion key={3} value={answers.roofArea} onAnswer={(v) => s.handleAnswer('roofArea', v)} onBack={back} />
      case 4:
        return <RoofTypeQuestion key={4} value={answers.roofType} onAnswer={(v) => s.handleAnswer('roofType', v)} onBack={back} />
      case 5:
        return <ShadingQuestion key={5} value={answers.shading} onAnswer={(v) => s.handleAnswer('shading', v)} onBack={back} />
      case 6:
        return <CleaningQuestion key={6} value={answers.cleaning} onAnswer={(v) => s.handleAnswer('cleaning', v)} onBack={back} />
      case 7:
        return <FutureUsageQuestion key={7} value={answers.futureUsage} onAnswer={(v) => s.handleAnswer('futureUsage', v)} onBack={back} />
      default:
        return null
    }
  }

  return (
    <main className="relative min-h-[100svh] w-full bg-paper">
      <GrainOverlay />
      <Cursor />
      <Navigation
        step={phase === 'questions' ? activeQuestion + 1 : undefined}
        total={s.totalQuestions}
        onSkip={phase === 'questions' ? s.skip : undefined}
        onHome={phase !== 'hero' ? s.restart : undefined}
      />

      <AnimatePresence mode="wait">
        {phase === 'hero' && (
          <motion.div key="hero" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <Hero onBegin={s.begin} />
          </motion.div>
        )}

        {phase === 'questions' && (
          <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <AnimatePresence mode="wait">{renderQuestion()}</AnimatePresence>
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <LoadingScreen />
          </motion.div>
        )}

        {phase === 'results' && results && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <ResultsScreen results={results} answers={answers} insights={insights} onRestart={s.restart} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
