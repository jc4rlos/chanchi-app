import { z } from 'zod'

export const branchSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  isActive: z.boolean(),
})

export type Branch = z.infer<typeof branchSchema>

export const branchFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  isActive: z.boolean(),
})

export type BranchFormValues = z.infer<typeof branchFormSchema>
