import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { SolarAnswers, SolarResults } from '@/types'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const WEATHER_LABELS: Record<string, string> = {
  sunny: 'Mostly Sunny',
  moderate: 'Moderate',
  cloudy: 'Cloudy',
  rainfall: 'Heavy Rainfall Region',
}

const CLEANING_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Every 3 Months',
  rarely: 'Rarely',
  never: 'Never',
}

const SHADING_LABELS: Record<string, string> = {
  none: 'No Shading',
  trees: 'Trees',
  buildings: 'Buildings',
  water_tank: 'Water Tank',
  heavy: 'Heavy Shade',
}

const ROOF_LABELS: Record<string, string> = {
  rcc: 'RCC (Concrete)',
  metal: 'Metal',
  tile: 'Tile',
  ground: 'Ground Mount',
}

const FUTURE_LABELS: Record<string, string> = {
  same: 'Same as now',
  slight: 'Slight increase',
  significant: 'Significant increase',
  ev: 'Planning to buy an EV',
  more_acs: 'Adding more ACs',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: SolarAnswers = body.answers
    const results: SolarResults = body.results

    const prompt = `You are a solar energy advisor. A customer has completed a solar savings assessment. Based on their data and calculations, generate exactly 4 concise, specific, and actionable insights. Each insight should be one or two sentences. Do not repeat the calculated numbers — explain what they mean or how the user can improve.

Customer Profile:
- Location: ${answers.location?.address ?? 'Not specified'}
- Monthly Electricity Bill: ₹${answers.monthlyBill?.toLocaleString('en-IN') ?? 'N/A'}
- Weather: ${WEATHER_LABELS[answers.weather ?? ''] ?? answers.weather}
- Roof Area: ${answers.roofArea ?? 'N/A'} sq ft
- Roof Type: ${ROOF_LABELS[answers.roofType ?? ''] ?? answers.roofType}
- Panel Cleaning: ${CLEANING_LABELS[answers.cleaning ?? ''] ?? answers.cleaning}
- Shading: ${SHADING_LABELS[answers.shading ?? ''] ?? answers.shading}
- Future Usage: ${FUTURE_LABELS[answers.futureUsage ?? ''] ?? answers.futureUsage}

Calculated Results:
- Solar Suitability Score: ${results.suitabilityScore}/100
- Recommended System: ${results.systemSizeKw} kW (${results.numPanels} panels)
- Annual Generation: ${results.annualGenerationKwh.toLocaleString()} kWh
- Monthly Savings: ₹${results.monthlySavingsINR.toLocaleString('en-IN')}
- Payback Period: ${results.paybackPeriodYears} years
- 25-Year Savings: ₹${(results.savingsIn25YearsINR / 100000).toFixed(1)} Lakhs

Return a JSON array of exactly 4 strings. No extra text. Example format: ["insight 1", "insight 2", "insight 3", "insight 4"]`

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 400,
    })

    const text = response.choices[0].message.content ?? '{}'
    let parsed: { insights?: string[] } = {}
    try {
      parsed = JSON.parse(text)
    } catch {
      const match = text.match(/\[[\s\S]*\]/)
      if (match) parsed = { insights: JSON.parse(match[0]) }
    }

    return NextResponse.json({ insights: parsed.insights ?? [] })
  } catch (error) {
    console.error('Insights error:', error)
    return NextResponse.json({ insights: [] }, { status: 200 })
  }
}
