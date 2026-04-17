import { createFileRoute } from '@tanstack/react-router'
import { BranchCreate } from '@/features/branches/branch-create'

export const Route = createFileRoute('/_authenticated/branches/new')({
  component: BranchCreate,
})
