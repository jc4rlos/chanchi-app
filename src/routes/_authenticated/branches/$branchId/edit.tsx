import { createFileRoute } from '@tanstack/react-router'
import { BranchEdit } from '@/features/branches/branch-edit'

export const Route = createFileRoute('/_authenticated/branches/$branchId/edit')(
  {
    component: BranchEdit,
  }
)
