import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@boilerplate/ui'

const SKELETON_ROWS = 8

export const EmployeesTableSkeleton = () => (
  <div className='flex flex-1 flex-col gap-4'>
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-37.5 lg:w-62.5' />
        <Skeleton className='h-8 w-20' />
        <Skeleton className='h-8 w-24' />
        <Skeleton className='h-8 w-24' />
      </div>
      <Skeleton className='h-8 w-28' />
    </div>

    <div className='overflow-hidden rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-10'>
              <Skeleton className='h-4 w-4' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-36' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-28' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-24' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-24' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-28' />
            </TableHead>
            <TableHead>
              <Skeleton className='h-4 w-20' />
            </TableHead>
            <TableHead className='w-10' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className='h-4 w-4' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-44' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-28' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-24' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-24' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-24' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-20 rounded-full' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-8 w-8 rounded-md' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    <div className='flex items-center justify-between'>
      <Skeleton className='h-4 w-36' />
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-8' />
        <Skeleton className='h-8 w-8' />
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-8' />
        <Skeleton className='h-8 w-8' />
      </div>
    </div>
  </div>
)
