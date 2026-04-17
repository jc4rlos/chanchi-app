import { useNavigate } from '@tanstack/react-router'
import { Button } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { BranchForm } from './components/branch-form'
import { type BranchFormValues } from './data/schema'
import { useCreateBranch } from './hooks/use-branches'

export const BranchCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreateBranch()

  const handleSubmit = (values: BranchFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/branches' }),
    })
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
              Nueva Sucursal
            </h2>
            <p className='text-muted-foreground'>
              Completa los datos para crear una sucursal.
            </p>
          </div>
        </div>

        <div className='max-w-2xl'>
          <BranchForm
            defaultValues={{
              name: '',
              address: '',
              phone: '',
              email: '',
              isActive: true,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isPending={createMutation.isPending}
            submitLabel='Crear Sucursal'
          />
        </div>
      </Main>
    </>
  )
}
