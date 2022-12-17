import { z } from 'zod'

export const $eq = z.literal('$eq')
export const $neq = z.literal('$neq')
export const $contains = z.literal('$contains')
export const $starts_with = z.literal('$starts_with')
export const $ends_with = z.literal('$ends_with')
export const $regex = z.literal('$regex')

export const $gt = z.literal('$gt')
export const $lt = z.literal('$lt')
export const $gte = z.literal('$gte')
export const $lte = z.literal('$lte')

export const $is_today = z.literal('$is_today')

export const stringFilterOperators = z.union([$eq, $neq, $contains, $starts_with, $ends_with, $regex])

export const numberFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte])

export const dateFilterOperators = z.union([$eq, $neq, $gt, $gte, $lt, $lte, $is_today])
export type IDateFilterOperator = z.infer<typeof dateFilterOperators>

/**
 * built in date operators
 */
export const dateBuiltInOperators = new Set<IDateFilterOperator>(['$is_today'])