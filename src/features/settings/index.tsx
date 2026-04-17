import { Outlet } from '@tanstack/react-router'
import { Separator } from '@boilerplate/ui'
import { Main } from '@/components/layout/main'

export const Settings = () => (
  <Main fixed>
    <div className='space-y-0.5'>
      <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
        Settings
      </h1>
      <p className='text-muted-foreground'>
        Manage your account settings and set e-mail preferences.
      </p>
    </div>
    <Separator className='my-4 lg:my-6' />
    <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
      <div className='flex w-full overflow-y-hidden p-1'>
        <Outlet />
      </div>
    </div>
  </Main>
)
