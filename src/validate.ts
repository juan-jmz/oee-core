import { OEESummaryInput } from "./types"

export function validateInput(input: OEESummaryInput): void {
  const {
    plannedProductionTime,
    unplannedDowntime,
    production,
    totalCalendarTime
  } = input

  if (plannedProductionTime <= 0) {
    throw new Error("plannedProductionTime must be greater than 0")
  }

  if (unplannedDowntime < 0) {
    throw new Error("unplannedDowntime cannot be negative")
  }

  if (unplannedDowntime > plannedProductionTime) {
    throw new Error("unplannedDowntime cannot exceed plannedProductionTime")
  }

  if (!production || production.length === 0) {
    throw new Error("production array cannot be empty")
  }

  for (const run of production) {
    if (run.idealCycleTime <= 0) {
      throw new Error("idealCycleTime must be greater than 0")
    }

    if (run.totalCount < 0) {
      throw new Error("totalCount cannot be negative")
    }

    if (run.goodCount < 0) {
      throw new Error("goodCount cannot be negative")
    }

    if (run.goodCount > run.totalCount) {
      throw new Error("goodCount cannot exceed totalCount")
    }
  }

  if (totalCalendarTime !== undefined) {
    if (totalCalendarTime <= 0) {
      throw new Error("totalCalendarTime must be greater than 0")
    }

    if (totalCalendarTime < plannedProductionTime) {
      throw new Error(
        "totalCalendarTime cannot be less than plannedProductionTime"
      )
    }
  }
}