import { OEESummaryInput, OEEResult } from "./types"
import { validateInput } from "./validate"

export function calculate(input: OEESummaryInput): OEEResult {
  validateInput(input)

  const {
    plannedProductionTime,
    unplannedDowntime,
    production,
    totalCalendarTime
  } = input

  const operatingTime =
    plannedProductionTime - unplannedDowntime

  const totalIdealTime = production.reduce(
    (sum, run) => sum + run.idealCycleTime * run.totalCount,
    0
  )

  const totalCount = production.reduce(
    (sum, run) => sum + run.totalCount,
    0
  )

  const goodCount = production.reduce(
    (sum, run) => sum + run.goodCount,
    0
  )

  const availability =
    operatingTime / plannedProductionTime

  const performance =
    operatingTime === 0 ? 0 : totalIdealTime / operatingTime

  const quality =
    totalCount === 0 ? 0 : goodCount / totalCount

  const oee = availability * performance * quality

  let utilization: number | undefined
  let teep: number | undefined

  if (totalCalendarTime !== undefined) {
    utilization =
      plannedProductionTime / totalCalendarTime

    teep = oee * utilization
  }

  return {
    availability,
    performance,
    quality,
    oee,
    utilization,
    teep
  }
}