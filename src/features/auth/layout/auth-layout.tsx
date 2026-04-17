import type { FC, PropsWithChildren } from 'react'
import { Logo } from '@/assets/logo'

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className='grid h-svh max-w-none items-center px-2 md:container'>
    <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-120 sm:p-8'>
      <div className='mb-4 flex items-center justify-center'>
        <Logo className='me-2' />
        <h1 className='text-xl font-medium'>Shadcn Admin</h1>
      </div>
      {children}
    </div>
  </div>
)
