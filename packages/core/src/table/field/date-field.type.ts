import { z } from 'zod'
import { DateField } from './date-field.js'
import { baseFieldQuerySchema, createBaseFieldSchema, updateBaseFieldSchema } from './field-base.schema.js'
import { FIELD_TYPE_KEY } from './field.constants.js'
import { timeFormat } from './value-objects/time-format.vo.js'

export const dateTypeSchema = z.literal('date')
export type DateType = z.infer<typeof dateTypeSchema>
const dateTypeObjectSchema = z.object({ [FIELD_TYPE_KEY]: dateTypeSchema })
const dateObjectSchema = z.object({ format: z.string().optional(), timeFormat: timeFormat.optional() })

export const createDateFieldSchema = createBaseFieldSchema.merge(dateTypeObjectSchema).merge(dateObjectSchema)
export type ICreateDateFieldSchema = z.infer<typeof createDateFieldSchema>

export const updateDateFieldSchema = updateBaseFieldSchema.merge(dateTypeObjectSchema).merge(dateObjectSchema)
export type IUpdateDateFieldInput = z.infer<typeof updateDateFieldSchema>

export const dateFieldQuerySchema = baseFieldQuerySchema.merge(dateTypeObjectSchema).merge(dateObjectSchema)
export type IDateFieldQuerySchema = z.infer<typeof dateFieldQuerySchema>

export const dateFieldValue = z.date().or(z.null())
export type IDateFieldValue = z.infer<typeof dateFieldValue>

export const createDateFieldValue = z.string().nullable()
export type ICreateDateFieldValue = z.infer<typeof createDateFieldValue>

export const dateFieldQueryValue = z.string().nullable()
export type IDateFieldQueryValue = z.infer<typeof dateFieldQueryValue>

export const createDateFieldValue_internal = z
  .object({ value: createDateFieldValue })
  .merge(dateTypeObjectSchema)
  .merge(z.object({ field: z.instanceof(DateField) }))

export type ICreateDateFieldValue_internal = z.infer<typeof createDateFieldValue_internal>

export const isDateField = z.instanceof(DateField)
