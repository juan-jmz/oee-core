# oee-core
A dependency-free, mathematically correct OEE calculation engine for industrial systems, built in TypeScript.

## Overview
oee-core is a lightweight, summary-driven library for calculating Overall Equipment Effectiveness (OEE) using production totals.

It is designed to enforce correct mathematical computation and aggregation, avoiding common mistakes such as averaging pre-calculated KPIs.

The library does not handle:

- Data collection
- PLC communication
- MQTT publishing
- Database access
- Event timelines

It focuses exclusively on deterministic calculations based on structured input data.

## Why this library exists

Most OEE implementations in real systems are incorrect. A common mistake is averaging KPIs across machines, shifts, or lines:

```bash
OEE_total = average(OEE_machine_1, OEE_machine_2)
```

This produces misleading results.

oee-core enforces correct aggregation by requiring base production data and recalculating OEE from first principles.

## Installation

```bash
npm install @juan-jmz/oee-core
```

## Design Principles

- Summary-driven (no event timelines)
- Deterministic and stateless
- No external dependencies
- Mathematically correct aggregation
- Strict input validation
- Infrastructure-agnostic

## Data Model

### ProductionRun

Represents production for a specific product or configuration.

```TypeScript
export interface ProductionRun {
  idealCycleTime: number
  totalCount: number
  goodCount: number
}
```

### OEESummaryInput

Represents production totals for a defined period (shift, day, machine, etc.).

```TypeScript
export interface OEESummaryInput {
  plannedProductionTime: number
  unplannedDowntime: number
  production: ProductionRun[]
  totalCalendarTime?: number
}
```

### OEEResult

```TypeScript
export interface OEEResult {
  availability: number
  performance: number
  quality: number
  oee: number
  utilization?: number
  teep?: number
}
```

### Units

The library does not enforce specific units, but all time values must be consistent.

Example:

- If plannedProductionTime is in seconds 
- idealCycleTime must also be in seconds


### Extended Metrics (Utilization & TEEP)

If totalCalendarTime is provided, the library will also compute:

- Utilization
- TEEP

```TypeScript
const result = calculate({
  plannedProductionTime: 28800,
  unplannedDowntime: 3600,
  totalCalendarTime: 86400,
  production: [
    {
      idealCycleTime: 1.2,
      totalCount: 8000,
      goodCount: 7800
    }
  ]
})
```

### Basic Usage

```TypeScript
import { calculate } from "@juanjmz/oee-core"

const result = calculate({
  plannedProductionTime: 28800,
  unplannedDowntime: 3600,
  production: [
    {
      idealCycleTime: 1.2,
      totalCount: 8000,
      goodCount: 7800
    },
    {
      idealCycleTime: 0.9,
      totalCount: 10000,
      goodCount: 9700
    }
  ]
})

console.log(result)
```

## Calculation Model

### Availability

$$
Operating\ Time = Planned\ Production\ Time - Unplanned\ Downtime
$$

$$
Availability = \frac{Operating\ Time}{Planned\ Production\ Time}
$$

### Performance

$$
Performance = \frac{\sum (Ideal\ Cycle\ Time \times Total\ Count)}{Operating\ Time}
$$

### Quality


$$
Quality = \frac{Good\ Count}{Total\ Count}
$$

## Utilization

$$
Utilization = \frac{Planned\ Production\ Time}{Total\ Calendar\ Time}
$$

## TEEP

$$
TEEP = OEE \times Utilization
$$

## Aggregation (Correct Method)

Never average KPIs.

Incorrect:

```TypeScript
average(OEE_shift_1, OEE_shift_2)
```

Correct:

```TypeScript
import { aggregate } from "@juanjmz/oee-core"

const result = aggregate([
  shift1,
  shift2,
  shift3
])
```

Aggregation works by:

- Summing planned production time
- Summing unplanned downtime
- Merging production runs
- Recalculating OEE from base data

# Validation Rules

The library throws errors if:

- plannedProductionTime <= 0
- unplannedDowntime < 0
- unplannedDowntime > plannedProductionTime
- production array is empty
- totalCount < 0
- goodCount < 0
- goodCount > totalCount
- idealCycleTime <= 0
- totalCalendarTime <= 0 (if provided)
- totalCalendarTime < plannedProductionTime (if provided)

Invalid input fails fast

## Edge Cases

Defined behavior:

- If totalCount = 0 → quality = 0
- If operatingTime = 0 → performance = 0
- If plannedProductionTime = 0 → throws error

## What This Library Does Not Do

- No event timeline processing
- No downtime classification
- No shift management
- No production scheduling
- No data persistence

Those concerns belong to higher-level systems.

## Intended Use Cases
- Industrial backend systems
- OEE dashboards
- MES integrations
- Data pipelines
- Analytics services

## Example Output
```TypeScript
{
  availability: 0.875,
  performance: 0.91,
  quality: 0.97,
  oee: 0.77
  utilization: 0.33,
  teep: 0.25
}
```

# Roadmap

- Extended aggregation utilities
- Optional strict mode configuration
- Helper utilities for data normalization
- Integration helpers (separate packages)

# License
- MIT

# Author
- Juan Manuel Jiménez [juan.jimenez.c13@gmail.com]