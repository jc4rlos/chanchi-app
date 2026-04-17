import { useState } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button } from '@boilerplate/ui'
import { PlusCircle } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { BranchDeleteDialog } from './components/branch-delete-dialog'
import { BranchesTable } from './components/branches-table'
import { BranchesTableSkeleton } from './components/branches-table-skeleton'
import { type Branch } from './data/schema'
import { useBranches } from './hooks/use-branches'

const route = getRouteApi('/_authenticated/branches/')

export const Branches = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null)

  const { data, isLoading, isError, error } = useBranches({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    name: search.name,
    isActive: search.isActive,
  })

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Sucursales</h2>
            <p className='text-muted-foreground'>
              Administra tus sucursales aquí.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/branches/new' })}
            className='space-x-1'
          >
            <span>Nueva Sucursal</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar sucursales: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <BranchesTableSkeleton />
        ) : (
          <BranchesTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onDelete={setBranchToDelete}
          />
        )}
      </Main>

      {branchToDelete && (
        <BranchDeleteDialog
          open={!!branchToDelete}
          onOpenChange={(open) => {
            if (!open) setBranchToDelete(null)
          }}
          branch={branchToDelete}
        />
      )}
    </>
  )
}
