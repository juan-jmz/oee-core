import { OEESummaryInput, OEEResult } from "./types"
import { calculate } from "./calculate"

export function aggregate(
  inputs: OEESummaryInput[]
): OEEResult {
  if (!inputs || inputs.length === 0) {
    throw new Error("inputs array cannot be empty")
  }

  const aggregated = inputs.reduce<OEESummaryInput>(
    (acc, current) => {
      acc.plannedProductionTime += current.plannedProductionTime
      acc.unplannedDowntime += current.unplannedDowntime

      acc.production.push(...current.production)

      if (
        acc.totalCalendarTime !== undefined &&
        current.totalCalendarTime !== undefined
      ) {
        acc.totalCalendarTime += current.totalCalendarTime
      }

      return acc
    },
    {
      plannedProductionTime: 0,
      unplannedDowntime: 0,
      production: [],
      totalCalendarTime: inputs[0].totalCalendarTime
        ? 0
        : undefined
    }
  )

  return calculate(aggregated)
}