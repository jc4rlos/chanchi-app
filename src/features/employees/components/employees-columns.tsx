import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@boilerplate/ui'
import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Employee, employeeRoleLabels } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const employeesColumns: ColumnDef<Employee>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todo'
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Seleccionar fila'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'fullName',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3'>
        {row.original.firstName} {row.original.lastName}
      </LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'documentNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Documento' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {row.getValue('documentNumber')}
      </span>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rol' />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as keyof typeof employeeRoleLabels
      return <span>{employeeRoleLabels[role] ?? role}</span>
    },
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Teléfono' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {(row.getValue('phone') as string | null) ?? '—'}
      </span>
    ),
  },
  {
    accessorKey: 'hireDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha contratación' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('hireDate') as string
      return (
        <span className='text-muted-foreground'>
          {new Date(date + 'T00:00:00').toLocaleDateString('es', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </span>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return isActive ? (
        <span className='flex items-center gap-1 text-teal-600 dark:text-teal-400'>
          <CheckCircle size={15} />
          Activo
        </span>
      ) : (
        <span className='flex items-center gap-1 text-muted-foreground'>
          <XCircle size={15} />
          Inactivo
        </span>
      )
    },
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: { className: 'w-10' },
  },
]
