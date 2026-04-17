import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Branches } from '@/features/branches'

const branchesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  name: z.string().optional().catch(''),
  isActive: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/branches/')({
  validateSearch: branchesSearchSchema,
  component: Branches,
})
