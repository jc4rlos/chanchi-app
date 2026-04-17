import { useEffect, useMemo, useState } from 'react'
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
import { createBranchColumns } from '../components/branches-columns'
import { type Branch } from '../data/schema'

type UseBranchesTableParams = {
  data: Branch[]
  total: number
  search: Record<string, unknown>
  navigate: NavigateFn
  onDelete: (branch: Branch) => void
}

export const useBranchesTable = ({
  data,
  total,
  search,
  navigate,
  onDelete,
}: UseBranchesTableParams) => {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(() => createBranchColumns(onDelete), [onDelete])

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
      { columnId: 'name', searchKey: 'name', type: 'string' },
      { columnId: 'isActive', searchKey: 'isActive', type: 'array' },
    ],
  })

  const [nameInput, setNameInput] = useState(() => {
    const filter = columnFilters.find((f) => f.id === 'name')
    return typeof filter?.value === 'string' ? filter.value : ''
  })

  useEffect(() => {
    const filter = columnFilters.find((f) => f.id === 'name')
    setNameInput(typeof filter?.value === 'string' ? filter.value : '')
  }, [columnFilters])

  const handleSearch = () => {
    const next: ColumnFiltersState = [
      ...columnFilters.filter((f) => f.id !== 'name'),
      ...(nameInput.trim() ? [{ id: 'name', value: nameInput.trim() }] : []),
    ]
    onColumnFiltersChange(next)
  }

  const handleReset = () => {
    setNameInput('')
    onColumnFiltersChange([])
  }

  const pageCount = Math.ceil(total / (pagination?.pageSize ?? 10))

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
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

  return {
    table,
    nameInput,
    setNameInput,
    handleSearch,
    handleReset,
    isFiltered: columnFilters.length > 0 || nameInput.trim() !== '',
  }
}
