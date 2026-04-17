import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Branch } from '../data/schema'
import { useDeleteBranch } from '../hooks/use-branches'

type BranchDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch: Branch
}

export const BranchDeleteDialog = ({
  open,
  onOpenChange,
  branch,
}: BranchDeleteDialogProps) => {
  const deleteMutation = useDeleteBranch()

  const handleDelete = () => {
    deleteMutation.mutate(branch.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />
          Eliminar Sucursal
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar{' '}
            <span className='font-bold'>{branch.name}</span>? Esta acción no se
            puede deshacer.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription>
              Ten cuidado, esta operación no se puede revertir.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
      destructive
    />
  )
}
