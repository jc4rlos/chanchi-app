import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button, Skeleton } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { BranchForm } from './components/branch-form'
import { type BranchFormValues } from './data/schema'
import { useBranch, useUpdateBranch } from './hooks/use-branches'

const route = getRouteApi('/_authenticated/branches/$branchId/edit')

export const BranchEdit = () => {
  const { branchId } = route.useParams()
  const id = Number(branchId)
  const navigate = useNavigate()
  const updateMutation = useUpdateBranch()

  const { data: branch, isLoading, isError } = useBranch(id)

  const handleSubmit = (values: BranchFormValues) => {
    updateMutation.mutate(
      { id, values },
      { onSuccess: () => navigate({ to: '/branches' }) }
    )
  }

  const handleCancel = () => navigate({ to: '/branches' })

  return (
    <>
      <Main className='flex flex-1 flex-col gap-6'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleCancel}
            aria-label='Volver'
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Editar Sucursal
            </h2>
            <p className='text-muted-foreground'>
              Actualiza los datos de la sucursal.
            </p>
          </div>
        </div>

        <div className='max-w-2xl'>
          {isLoading && (
            <div className='space-y-4'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
          )}

          {isError && (
            <p className='text-sm text-destructive'>
              No se pudo cargar la sucursal.
            </p>
          )}

          {branch && (
            <BranchForm
              defaultValues={{
                name: branch.name,
                address: branch.address,
                phone: branch.phone ?? '',
                email: branch.email ?? '',
                isActive: branch.isActive,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isPending={updateMutation.isPending}
              submitLabel='Guardar Cambios'
            />
          )}
        </div>
      </Main>
    </>
  )
}
