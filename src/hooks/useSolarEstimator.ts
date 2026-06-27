'use client'

import { useState, useCallback } from 'react'
import type { SolarAnswers, SolarResults, AppPhase } from '@/types'
import { calculateSolarResults } from '@/lib/calculations'

export function useSolarEstimator() {
  const [phase, setPhase] = useState<AppPhase>('hero')
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [answers, setAnswers] = useState<SolarAnswers>({})
  const [results, setResults] = useState<SolarResults | null>(null)
  const [insights, setInsights] = useState<string[]>([])

  const totalQuestions = 5

  const runCalculation = useCallback((finalAnswers: SolarAnswers) => {
    setPhase('loading')
    const calc = calculateSolarResults(finalAnswers)
    setResults(calc)
    setInsights([])

    // Insights stream in parallel with the loading sequence.
    fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: finalAnswers, results: calc }),
    })
      .then((res) => res.json())
      .then((data) => setInsights(data.insights ?? []))
      .catch(() => setInsights([]))

    window.setTimeout(() => setPhase('results'), 5200)
  }, [])

  const handleAnswer = useCallback(
    (key: keyof SolarAnswers, value: SolarAnswers[keyof SolarAnswers]) => {
      const updated = { ...answers, [key]: value }
      setAnswers(updated)

      if (activeQuestion < totalQuestions - 1) {
        setActiveQuestion((prev) => prev + 1)
      } else {
        runCalculation(updated)
      }
    },
    [answers, activeQuestion, runCalculation],
  )

  const begin = useCallback(() => {
    setActiveQuestion(0)
    setPhase('questions')
  }, [])

  const skip = useCallback(() => {
    runCalculation(answers)
  }, [answers, runCalculation])

  const goBack = useCallback(() => {
    setActiveQuestion((prev) => Math.max(0, prev - 1))
  }, [])

  const restart = useCallback(() => {
    setPhase('hero')
    setActiveQuestion(0)
    setAnswers({})
    setResults(null)
    setInsights([])
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [])

  const progress = (activeQuestion / totalQuestions) * 100

  return {
    phase,
    activeQuestion,
    answers,
    results,
    insights,
    progress,
    totalQuestions,
    handleAnswer,
    begin,
    skip,
    goBack,
    restart,
  }
}
