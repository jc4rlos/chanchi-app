import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useState,
} from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Employee } from '../data/schema'

type EmployeesDialogType = 'add' | 'edit' | 'delete' | 'access'

type EmployeesContextType = {
  open: EmployeesDialogType | null
  setOpen: (str: EmployeesDialogType | null) => void
  currentRow: Employee | null
  setCurrentRow: Dispatch<React.SetStateAction<Employee | null>>
}

const EmployeesContext = createContext<EmployeesContextType | null>(null)

export const EmployeesProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useDialogState<EmployeesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Employee | null>(null)

  return (
    <EmployeesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </EmployeesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployeesContext = () => {
  const ctx = useContext(EmployeesContext)
  if (!ctx)
    throw new Error(
      'useEmployeesContext must be used within <EmployeesProvider>'
    )
  return ctx
}
