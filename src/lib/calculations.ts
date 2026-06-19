import type {
  SolarAnswers,
  SolarResults,
  WeatherType,
  RoofType,
  CleaningFrequency,
  ShadingType,
  FutureUsage,
} from '@/types'

const TARIFF_RATE_INR = 8 // INR per kWh
const SYSTEM_EFFICIENCY = 0.80
const PANEL_WATT = 400 // W per panel
const SQ_FT_PER_KW = 90 // roof area per kW
const COST_PER_KW_INR = 58000 // installation cost per kW
const PANEL_DEGRADATION = 0.005 // 0.5% per year
const ELECTRICITY_ESCALATION = 0.055 // 5.5% annual tariff increase

const PEAK_SUN_HOURS: Record<WeatherType, number> = {
  sunny: 5.5,
  moderate: 4.5,
  cloudy: 3.5,
  rainfall: 2.8,
}

const ROOF_TYPE_FACTOR: Record<RoofType, number> = {
  rcc: 1.0,
  metal: 0.97,
  tile: 0.92,
  ground: 1.06,
}

const SHADING_FACTOR: Record<ShadingType, number> = {
  none: 1.0,
  trees: 0.92,
  buildings: 0.85,
  water_tank: 0.95,
  heavy: 0.70,
}

const CLEANING_FACTOR: Record<CleaningFrequency, number> = {
  weekly: 1.0,
  monthly: 0.97,
  quarterly: 0.93,
  rarely: 0.88,
  never: 0.82,
}

const FUTURE_MULTIPLIER: Record<FutureUsage, number> = {
  same: 1.0,
  slight: 1.15,
  significant: 1.35,
  ev: 1.55,
  more_acs: 1.28,
}

const WEATHER_SUITABILITY: Record<WeatherType, number> = {
  sunny: 100,
  moderate: 78,
  cloudy: 55,
  rainfall: 38,
}

const SHADING_SUITABILITY: Record<ShadingType, number> = {
  none: 100,
  trees: 85,
  buildings: 68,
  water_tank: 90,
  heavy: 48,
}

const ROOF_SUITABILITY: Record<RoofType, number> = {
  rcc: 100,
  metal: 95,
  tile: 88,
  ground: 100,
}

export function calculateSolarResults(answers: SolarAnswers): SolarResults {
  const {
    monthlyBill = 5000,
    weather = 'moderate',
    roofArea = 1000,
    roofType = 'rcc',
    cleaning = 'monthly',
    shading = 'none',
    futureUsage = 'same',
  } = answers

  const peakSunHours = PEAK_SUN_HOURS[weather]
  const roofFactor = ROOF_TYPE_FACTOR[roofType]
  const shadingFactor = SHADING_FACTOR[shading]
  const cleaningFactor = CLEANING_FACTOR[cleaning]
  const futureMult = FUTURE_MULTIPLIER[futureUsage]

  const monthlyUnits = monthlyBill / TARIFF_RATE_INR
  const annualUnits = monthlyUnits * 12
  const adjustedAnnualUnits = annualUnits * futureMult

  const requiredKw = adjustedAnnualUnits / (peakSunHours * 365 * SYSTEM_EFFICIENCY)
  const maxKwFromRoof = roofArea / SQ_FT_PER_KW
  const rawSystemKw = Math.min(requiredKw, maxKwFromRoof) * roofFactor

  const systemSizeKw = Math.round(rawSystemKw * 10) / 10

  const annualGenerationKwh = Math.round(
    systemSizeKw * peakSunHours * 365 * SYSTEM_EFFICIENCY * shadingFactor * cleaningFactor
  )

  const numPanels = Math.ceil((systemSizeKw * 1000) / PANEL_WATT)

  const unitsOffset = Math.min(annualGenerationKwh, adjustedAnnualUnits)
  const annualSavingsINR = Math.round(unitsOffset * TARIFF_RATE_INR)
  const monthlySavingsINR = Math.round(annualSavingsINR / 12)

  const installationCostINR = Math.round(systemSizeKw * COST_PER_KW_INR)

  let cumulative25yr = 0
  for (let year = 1; year <= 25; year++) {
    const degradedGen = annualGenerationKwh * Math.pow(1 - PANEL_DEGRADATION, year)
    const escalatedRate = TARIFF_RATE_INR * Math.pow(1 + ELECTRICITY_ESCALATION, year)
    cumulative25yr += Math.min(degradedGen, adjustedAnnualUnits) * escalatedRate
  }
  const savingsIn25YearsINR = Math.round(cumulative25yr - installationCostINR)

  const paybackPeriodYears = Math.round((installationCostINR / annualSavingsINR) * 10) / 10

  const suitabilityScore = Math.round(
    WEATHER_SUITABILITY[weather] * 0.40 +
    SHADING_SUITABILITY[shading] * 0.35 +
    ROOF_SUITABILITY[roofType] * 0.25
  )

  let confidenceScore = 72
  if (weather === 'sunny') confidenceScore += 6
  if (shading === 'none') confidenceScore += 5
  if (cleaning === 'weekly' || cleaning === 'monthly') confidenceScore += 5
  if (roofType === 'rcc' || roofType === 'ground') confidenceScore += 4
  if (roofArea > 500) confidenceScore += 3
  confidenceScore = Math.min(94, confidenceScore)

  const cleaningImpact = Math.round((1 - cleaningFactor) * 100)
  const maintenanceImpact =
    cleaning === 'weekly'
      ? 'Optimal. No energy loss from soiling.'
      : cleaning === 'monthly'
      ? `Minimal. ~${3}% production loss from soiling.`
      : cleaning === 'quarterly'
      ? `Moderate. ~${cleaningImpact}% production loss. Monthly cleaning recommended.`
      : `Significant. ~${cleaningImpact}% production loss. Improve cleaning frequency.`

  return {
    suitabilityScore,
    systemSizeKw,
    numPanels,
    annualGenerationKwh,
    monthlySavingsINR,
    annualSavingsINR,
    savingsIn25YearsINR,
    paybackPeriodYears,
    maintenanceImpact,
    confidenceScore,
    installationCostINR,
  }
}

export function formatINR(value: number): string {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(2)} Cr`
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(2)} L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
  return `₹${value.toLocaleString('en-IN')}`
}
