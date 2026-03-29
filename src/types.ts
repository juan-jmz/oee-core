export interface ProductionRun {
  idealCycleTime: number
  totalCount: number
  goodCount: number
}

export interface OEESummaryInput {
  plannedProductionTime: number
  unplannedDowntime: number
  production: ProductionRun[]
  totalCalendarTime?: number
}

export interface OEEResult {
  availability: number
  performance: number
  quality: number
  oee: number
  utilization?: number
  teep?: number
}