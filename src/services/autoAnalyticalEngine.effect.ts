import { Effect, Layer, Context, Ref, pipe } from "effect"
import { supabase } from "@/integrations/supabase/client"

// ============================================================================
// Types
// ============================================================================

export interface AutoAnalyticalModel {
  id: string
  name: string
  partner_tag_id: string | null
  partner_id: string | null
  product_category_id: string | null
  product_id: string | null
  analytical_account_id: string
  status: "draft" | "confirmed" | "archived"
  is_archived: boolean
  priority: number
  created_at: string
  budget_id: string | null
}

export interface MatchContext {
  partnerId?: string
  productId?: string
  partnerTagIds?: string[]
  productCategoryId?: string
}

export interface AnalyticsAssignmentResult {
  analyticalAccountId: string | null
  matchedModelId: string | null
  matchedModelName: string | null
  budgetId: string | null
  matchScore: number
  matchedFields: string[]
  isAutoAssigned: boolean
}

// ============================================================================
// Errors
// ============================================================================

class DbError {
  readonly _tag = "DbError"
  constructor(readonly message: string) { }
}

// ============================================================================
// Services
// ============================================================================

class SupabaseService extends Context.Tag("SupabaseService")<
  SupabaseService,
  {
    fetchModels: Effect.Effect<AutoAnalyticalModel[], DbError>
    fetchPartnerTags: (id: string) => Effect.Effect<string[], DbError>
    fetchProductCategory: (id: string) => Effect.Effect<string | undefined, DbError>
  }
>() { }

export const SupabaseLive = Layer.succeed(
  SupabaseService,
  SupabaseService.of({
    fetchModels: Effect.tryPromise({
      try: async () => {
        const { data, error } = await supabase
          .from("auto_analytical_models")
          .select("*")
          .eq("status", "confirmed")
          .order("priority", { ascending: false })
          .order("created_at", { ascending: true })

        if (error) throw error

        return (data || []).map((m) => ({
          ...m,
          status: m.status as AutoAnalyticalModel["status"]
        }))
      },
      catch: (e) => new DbError(String(e))
    }),

    fetchPartnerTags: (id) =>
      Effect.tryPromise({
        try: async () => {
          const { data, error } = await supabase
            .from("contact_tags")
            .select("tag_id")
            .eq("contact_id", id)

          if (error) throw error
          return (data ?? []).map((x) => x.tag_id)
        },
        catch: (e) => new DbError(String(e))
      }),

    fetchProductCategory: (id) =>
      Effect.tryPromise({
        try: async () => {
          const { data, error } = await supabase
            .from("products")
            .select("category_id")
            .eq("id", id)
            .single()

          if (error) throw error
          return data?.category_id ?? undefined
        },
        catch: (e) => new DbError(String(e))
      })
  })
)

// ============================================================================
// Cache (Ref)
// ============================================================================

interface CacheState {
  models: AutoAnalyticalModel[]
  timestamp: number
}

const CACHE_TTL = 30_000

class Cache extends Context.Tag("Cache")<
  Cache,
  Ref.Ref<CacheState | null>
>() { }

export const CacheLive = Layer.effect(
  Cache,
  Ref.make<CacheState | null>(null)
)

// ============================================================================
// Core Logic
// ============================================================================

const getActiveModels = (force = false) =>
  Effect.gen(function* () {
    const cache = yield* Cache
    const db = yield* SupabaseService

    const now = Date.now()
    const current = yield* Ref.get(cache)

    if (!force && current && now - current.timestamp < CACHE_TTL) {
      return current.models
    }

    const models = yield* db.fetchModels

    yield* Ref.set(cache, {
      models,
      timestamp: now
    })

    return models
  })

// ============================================================================
// Context Builder
// ============================================================================

const buildMatchContext = (partnerId?: string, productId?: string) =>
  Effect.gen(function* () {
    const db = yield* SupabaseService

    const [tags, category] = yield* Effect.all([
      partnerId ? db.fetchPartnerTags(partnerId) : Effect.succeed([]),
      productId ? db.fetchProductCategory(productId) : Effect.succeed(undefined)
    ])

    return {
      partnerId,
      productId,
      partnerTagIds: tags,
      productCategoryId: category
    } satisfies MatchContext
  })

// ============================================================================
// Matching
// ============================================================================

const calculateMatchScore = (
  model: AutoAnalyticalModel,
  context: MatchContext
) => {
  let score = 0
  let valid = true
  let hasCondition = false
  const matched: string[] = []

  const check = (cond: boolean, name: string) => {
    hasCondition = true
    if (cond) {
      score++
      matched.push(name)
    } else {
      valid = false
    }
  }

  if (model.partner_tag_id) {
    check(
      context.partnerTagIds?.includes(model.partner_tag_id) ?? false,
      "Partner Tag"
    )
  }

  if (model.partner_id) {
    check(model.partner_id === context.partnerId, "Partner")
  }

  if (model.product_category_id) {
    check(
      model.product_category_id === context.productCategoryId,
      "Product Category"
    )
  }

  if (model.product_id) {
    check(model.product_id === context.productId, "Product")
  }

  if (!valid || !hasCondition) {
    return { score: 0, matchedFields: [], isValid: false }
  }

  return { score, matchedFields: matched, isValid: true }
}

// ============================================================================
// Best Match
// ============================================================================

const findBestMatch = (context: MatchContext) =>
  Effect.gen(function* () {
    const models = yield* getActiveModels()

    const matches = models
      .map((m) => ({
        model: m,
        ...calculateMatchScore(m, context)
      }))
      .filter((m) => m.isValid && m.score > 0)

    if (matches.length === 0) {
      return emptyResult
    }

    matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.model.priority !== a.model.priority)
        return b.model.priority - a.model.priority
      return (
        new Date(a.model.created_at).getTime() -
        new Date(b.model.created_at).getTime()
      )
    })

    const best = matches[0]

    return {
      analyticalAccountId: best.model.analytical_account_id,
      matchedModelId: best.model.id,
      matchedModelName: best.model.name,
      budgetId: best.model.budget_id,
      matchScore: best.score,
      matchedFields: best.matchedFields,
      isAutoAssigned: true
    } satisfies AnalyticsAssignmentResult
  })

const emptyResult: AnalyticsAssignmentResult = {
  analyticalAccountId: null,
  matchedModelId: null,
  matchedModelName: null,
  budgetId: null,
  matchScore: 0,
  matchedFields: [],
  isAutoAssigned: false
}

// ============================================================================
// Public API
// ============================================================================

export const autoAssignAnalyticalAccount = (
  partnerId?: string,
  productId?: string
) =>
  pipe(
    buildMatchContext(partnerId, productId),
    Effect.flatMap(findBestMatch),
    Effect.map((r) => r.analyticalAccountId ?? undefined)
  )

export const getAnalyticsAssignment = (
  partnerId?: string,
  productId?: string
) =>
  pipe(
    buildMatchContext(partnerId, productId),
    Effect.flatMap(findBestMatch)
  )

// ============================================================================
// Layer (ready to run)
// ============================================================================

export const AutoAnalyticalLive = Layer.mergeAll(
  SupabaseLive,
  CacheLive
)