import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button, Input } from '@boilerplate/ui'
import { Search } from 'lucide-react'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import {
  employeeRoleLabels,
  employeeRoles,
  type Employee,
} from '../data/schema'

type EmployeesToolbarProps = {
  table: Table<Employee>
  searchInput: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  onReset: () => void
  isFiltered: boolean
}

const roleOptions = employeeRoles.map((r) => ({
  label: employeeRoleLabels[r],
  value: r,
}))

export const EmployeesToolbar = ({
  table,
  searchInput,
  onSearchChange,
  onSearch,
  onReset,
  isFiltered,
}: EmployeesToolbarProps) => (
  <div className='flex items-center justify-between'>
    <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
      <div className='flex items-center gap-2'>
        <Input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch()
          }}
          placeholder='Buscar empleados...'
          className='h-8 w-37.5 lg:w-62.5'
        />
        <Button size='sm' onClick={onSearch} className='h-8 px-3'>
          <Search size={14} className='me-1' />
          Buscar
        </Button>
      </div>

      <div className='flex gap-x-2'>
        <DataTableFacetedFilter
          column={table.getColumn('role')}
          title='Rol'
          options={roleOptions}
        />
        <DataTableFacetedFilter
          column={table.getColumn('isActive')}
          title='Estado'
          options={[
            { label: 'Activo', value: 'true' },
            { label: 'Inactivo', value: 'false' },
          ]}
        />
      </div>

      {isFiltered && (
        <Button variant='ghost' onClick={onReset} className='h-8 px-2 lg:px-3'>
          Limpiar
          <Cross2Icon className='ms-2 h-4 w-4' />
        </Button>
      )}
    </div>

    <DataTableViewOptions table={table} />
  </div>
)
