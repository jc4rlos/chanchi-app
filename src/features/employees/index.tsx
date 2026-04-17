import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { EmployeesDialogs } from './components/employees-dialogs'
import { EmployeesPrimaryButtons } from './components/employees-primary-buttons'
import { EmployeesProvider } from './components/employees-provider'
import { EmployeesTable } from './components/employees-table'
import { EmployeesTableSkeleton } from './components/employees-table-skeleton'
import { useEmployees } from './hooks/use-employees'

const route = getRouteApi('/_authenticated/employees/')

export const Employees = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data, isLoading, isError, error } = useEmployees({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    search: search.search,
    role: search.role,
    isActive: search.isActive,
  })

  return (
    <EmployeesProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Empleados</h2>
            <p className='text-muted-foreground'>
              Administra los empleados de tu negocio aquí.
            </p>
          </div>
          <EmployeesPrimaryButtons />
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar empleados: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <EmployeesTableSkeleton />
        ) : (
          <EmployeesTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
          />
        )}
      </Main>

      <EmployeesDialogs />
    </EmployeesProvider>
  )
}
