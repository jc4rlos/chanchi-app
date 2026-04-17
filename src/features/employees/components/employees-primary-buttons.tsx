import { Button } from '@boilerplate/ui'
import { UserPlus } from 'lucide-react'
import { useEmployeesContext } from './employees-provider'

export const EmployeesPrimaryButtons = () => {
  const { setOpen } = useEmployeesContext()
  return (
    <Button className='space-x-1' onClick={() => setOpen('add')}>
      <span>Agregar Empleado</span> <UserPlus size={18} />
    </Button>
  )
}
