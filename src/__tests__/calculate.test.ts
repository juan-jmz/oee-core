import { describe, it, expect } from "vitest"
import { calculate } from "../calculate"

describe("calculate OEE", () => {
  it("should calculate OEE correctly for valid input", () => {
    const result = calculate({
      plannedProductionTime: 100,
      unplannedDowntime: 20,
      production: [
        {
          idealCycleTime: 1,
          totalCount: 80,
          goodCount: 72
        }
      ]
    })

    expect(result.availability).toBeCloseTo(0.8)
    expect(result.performance).toBeCloseTo(1)
    expect(result.quality).toBeCloseTo(0.9)
    expect(result.oee).toBeCloseTo(0.72)
  })
})

it("should return quality = 0 when totalCount is 0", () => {
  const result = calculate({
    plannedProductionTime: 100,
    unplannedDowntime: 20,
    production: [
      {
        idealCycleTime: 1,
        totalCount: 0,
        goodCount: 0
      }
    ]
  })

  expect(result.quality).toBe(0)
})

it("should return performance = 0 when operatingTime is 0", () => {
  const result = calculate({
    plannedProductionTime: 100,
    unplannedDowntime: 100,
    production: [
      {
        idealCycleTime: 1,
        totalCount: 50,
        goodCount: 50
      }
    ]
  })

  expect(result.performance).toBe(0)
})

it("should handle multiple production runs", () => {
  const result = calculate({
    plannedProductionTime: 100,
    unplannedDowntime: 20,
    production: [
      { idealCycleTime: 1, totalCount: 50, goodCount: 45 },
      { idealCycleTime: 2, totalCount: 10, goodCount: 10 }
    ]
  })

  expect(result.performance).toBeCloseTo(
    ((1 * 50) + (2 * 10)) / 80
  )
})

it("should calculate utilization and teep when totalCalendarTime is provided", () => {
  const result = calculate({
    plannedProductionTime: 100,
    unplannedDowntime: 20,
    totalCalendarTime: 200,
    production: [
      {
        idealCycleTime: 1,
        totalCount: 80,
        goodCount: 80
      }
    ]
  })

  expect(result.utilization).toBe(0.5)
  expect(result.teep).toBeCloseTo(result.oee * 0.5)
})

it("should throw error if goodCount > totalCount", () => {
  expect(() =>
    calculate({
      plannedProductionTime: 100,
      unplannedDowntime: 20,
      production: [
        {
          idealCycleTime: 1,
          totalCount: 10,
          goodCount: 20
        }
      ]
    })
  ).toThrow()
})