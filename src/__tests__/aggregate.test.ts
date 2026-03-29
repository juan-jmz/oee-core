import { describe, it, expect } from "vitest"
import { aggregate } from "../aggregate"
import { calculate } from "../calculate"


it("should aggregate multiple inputs correctly", () => {
  const result = aggregate([
    {
      plannedProductionTime: 100,
      unplannedDowntime: 20,
      production: [
        { idealCycleTime: 1, totalCount: 80, goodCount: 80 }
      ]
    },
    {
      plannedProductionTime: 100,
      unplannedDowntime: 10,
      production: [
        { idealCycleTime: 1, totalCount: 90, goodCount: 90 }
      ]
    }
  ])

  expect(result.availability).toBeCloseTo(
    (170 / 200)
  )
})

it("should throw if inputs array is empty", () => {
  expect(() => aggregate([])).toThrow()
})

it("should produce same result as manual aggregation", () => {
  const inputs = [
    {
      plannedProductionTime: 100,
      unplannedDowntime: 20,
      production: [
        { idealCycleTime: 1, totalCount: 80, goodCount: 80 }
      ]
    },
    {
      plannedProductionTime: 50,
      unplannedDowntime: 10,
      production: [
        { idealCycleTime: 2, totalCount: 20, goodCount: 20 }
      ]
    }
  ]

  const aggregated = aggregate(inputs)

  const manual = calculate({
    plannedProductionTime: 150,
    unplannedDowntime: 30,
    production: [
      ...inputs[0].production,
      ...inputs[1].production
    ]
  })

  expect(aggregated.oee).toBeCloseTo(manual.oee)
})