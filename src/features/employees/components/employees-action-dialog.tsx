import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@boilerplate/ui'
import {
  employeeFormSchema,
  type EmployeeFormValues,
  employeeRoleLabels,
  employeeRoles,
  type Employee,
} from '../data/schema'
import {
  useCreateEmployee,
  useUpdateEmployee,
  useBranches,
} from '../hooks/use-employees'

type EmployeeActionDialogProps = {
  currentRow?: Employee
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EmployeesActionDialog = ({
  currentRow,
  open,
  onOpenChange,
}: EmployeeActionDialogProps) => {
  const isEdit = !!currentRow
  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()
  const { data: branches = [] } = useBranches()

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: isEdit
      ? {
          branchId: currentRow.branchId,
          firstName: currentRow.firstName,
          lastName: currentRow.lastName,
          documentNumber: currentRow.documentNumber,
          role: currentRow.role,
          phone: currentRow.phone ?? '',
          email: currentRow.email ?? '',
          hireDate: currentRow.hireDate,
          isActive: currentRow.isActive,
        }
      : {
          branchId: undefined,
          firstName: '',
          lastName: '',
          documentNumber: '',
          role: undefined,
          phone: '',
          email: '',
          hireDate: '',
          isActive: true,
        },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              branchId: currentRow.branchId,
              firstName: currentRow.firstName,
              lastName: currentRow.lastName,
              documentNumber: currentRow.documentNumber,
              role: currentRow.role,
              phone: currentRow.phone ?? '',
              email: currentRow.email ?? '',
              hireDate: currentRow.hireDate,
              isActive: currentRow.isActive,
            }
          : {
              branchId: undefined,
              firstName: '',
              lastName: '',
              documentNumber: '',
              role: undefined,
              phone: '',
              email: '',
              hireDate: '',
              isActive: true,
            }
      )
    }
  }, [open, isEdit, currentRow, form])

  const onSubmit = (values: EmployeeFormValues) => {
    const payload = {
      branchId: values.branchId,
      firstName: values.firstName,
      lastName: values.lastName,
      documentNumber: values.documentNumber,
      role: values.role,
      phone: values.phone || null,
      email: values.email || null,
      hireDate: values.hireDate,
      isActive: values.isActive,
      authUserId: currentRow?.authUserId ?? null,
    }

    if (isEdit) {
      updateMutation.mutate(
        { id: currentRow.id, data: payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg' dismissible={false}>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza los datos del empleado. '
              : 'Registra un nuevo empleado. '}
            Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='employee-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='branchId'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Sucursal
                  </FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={field.value ? String(field.value) : ''}
                  >
                    <FormControl>
                      <SelectTrigger className='col-span-4'>
                        <SelectValue placeholder='Selecciona una sucursal' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Juan'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Apellido
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Pérez'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='documentNumber'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Documento
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='12345678'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Rol</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='col-span-4'>
                        <SelectValue placeholder='Selecciona un rol' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employeeRoles.map((r) => (
                        <SelectItem key={r} value={r}>
                          {employeeRoleLabels[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Teléfono
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='+54 9 11 1234 5678'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='juan@ejemplo.com'
                      className='col-span-4'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='hireDate'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>
                    Fecha contratación
                  </FormLabel>
                  <FormControl>
                    <Input type='date' className='col-span-4' {...field} />
                  </FormControl>
                  <FormMessage className='col-span-4 col-start-3' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                  <FormLabel className='col-span-2 text-end'>Activo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              form.reset()
              onOpenChange(false)
            }}
          >
            Cancelar
          </Button>
          <Button type='submit' form='employee-form' disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
