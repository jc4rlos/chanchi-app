import { useEffect, useState } from 'react'
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { employeesColumns } from '../components/employees-columns'
import { type Employee } from '../data/schema'

type UseEmployeesTableParams = {
  data: Employee[]
  total: number
  search: Record<string, unknown>
  navigate: NavigateFn
}

export const useEmployeesTable = ({
  data,
  total,
  search,
  navigate,
}: UseEmployeesTableParams) => {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'search', searchKey: 'search', type: 'string' },
      { columnId: 'role', searchKey: 'role', type: 'array' },
      { columnId: 'isActive', searchKey: 'isActive', type: 'array' },
    ],
  })

  const [searchInput, setSearchInput] = useState(() => {
    const filter = columnFilters.find((f) => f.id === 'search')
    return typeof filter?.value === 'string' ? filter.value : ''
  })

  useEffect(() => {
    const filter = columnFilters.find((f) => f.id === 'search')
    setSearchInput(typeof filter?.value === 'string' ? filter.value : '')
  }, [columnFilters])

  const handleSearch = () => {
    const next: ColumnFiltersState = [
      ...columnFilters.filter((f) => f.id !== 'search'),
      ...(searchInput.trim()
        ? [{ id: 'search', value: searchInput.trim() }]
        : []),
    ]
    onColumnFiltersChange(next)
  }

  const handleReset = () => {
    setSearchInput('')
    onColumnFiltersChange([])
  }

  const pageCount = Math.ceil(total / (pagination?.pageSize ?? 10))

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: employeesColumns,
    pageCount,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  const isFiltered = columnFilters.length > 0 || searchInput.trim() !== ''

  return {
    table,
    searchInput,
    setSearchInput,
    handleSearch,
    handleReset,
    isFiltered,
  }
}
