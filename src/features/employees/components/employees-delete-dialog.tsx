import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Employee } from '../data/schema'
import { useDeleteEmployee } from '../hooks/use-employees'

type EmployeeDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Employee
}

export const EmployeesDeleteDialog = ({
  open,
  onOpenChange,
  currentRow,
}: EmployeeDeleteDialogProps) => {
  const deleteMutation = useDeleteEmployee()

  const handleDelete = () => {
    deleteMutation.mutate(currentRow.id, {
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
          />{' '}
          Eliminar Empleado
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar a{' '}
            <span className='font-bold'>
              {currentRow.firstName} {currentRow.lastName}
            </span>
            ? Esta acción no se puede deshacer.
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
