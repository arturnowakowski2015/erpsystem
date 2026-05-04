
import { Effect } from "effect"
import {
  autoAssignAnalyticalAccount as effectVersion,
  getAnalyticsAssignment as effectFull,
  AutoAnalyticalLive
} from "./autoAnalyticalEngine.effect"

export async function autoAssignAnalyticalAccount(
  partnerId?: string,
  productId?: string
): Promise<string | undefined> {
  return Effect.runPromise(
    effectVersion(partnerId, productId).pipe(
      Effect.provide(AutoAnalyticalLive)
    )
  )
}

export async function getAnalyticsAssignment(
  partnerId?: string,
  productId?: string
) {
  return Effect.runPromise(
    effectFull(partnerId, productId).pipe(
      Effect.provide(AutoAnalyticalLive)
    )
  )
}

export async function batchAssignAnalyticalAccounts(lines: {
  lineId: string
  partnerId?: string
  productId?: string
}[]) {
  return Effect.runPromise(
    Effect.forEach(lines, (line) =>
      effectFull(line.partnerId, line.productId).pipe(
        Effect.map((r) => ({
          lineId: line.lineId,
          analyticalAccountId: r.analyticalAccountId,
          matchedModelId: r.matchedModelId,
          matchedModelName: r.matchedModelName,
          budgetId: r.budgetId
        }))
      )
    ).pipe(
      Effect.provide(AutoAnalyticalLive)
    )
  )
}

export {
  calculateModelPriority,
  getSpecificityLabel,
  validateModelConditions,
  invalidateModelCache
} from "./autoAnalyticalEngine"
