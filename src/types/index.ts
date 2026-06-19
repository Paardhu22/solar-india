export type WeatherType = 'sunny' | 'moderate' | 'cloudy' | 'rainfall'
export type RoofType = 'rcc' | 'metal' | 'tile' | 'ground'
export type CleaningFrequency = 'weekly' | 'monthly' | 'quarterly' | 'rarely' | 'never'
export type ShadingType = 'none' | 'trees' | 'buildings' | 'water_tank' | 'heavy'
export type FutureUsage = 'same' | 'slight' | 'significant' | 'ev' | 'more_acs'

export interface Location {
  address: string
  lat?: number
  lng?: number
}

export interface SolarAnswers {
  location?: Location
  monthlyBill?: number
  weather?: WeatherType
  roofArea?: number
  roofType?: RoofType
  cleaning?: CleaningFrequency
  shading?: ShadingType
  futureUsage?: FutureUsage
}

export interface SolarResults {
  suitabilityScore: number
  systemSizeKw: number
  numPanels: number
  annualGenerationKwh: number
  monthlySavingsINR: number
  annualSavingsINR: number
  savingsIn25YearsINR: number
  paybackPeriodYears: number
  maintenanceImpact: string
  confidenceScore: number
  installationCostINR: number
}

export type AppPhase = 'hero' | 'questions' | 'loading' | 'results'
