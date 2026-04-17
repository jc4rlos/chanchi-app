import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from '@boilerplate/ui'
import {
  AlertTriangle,
  KeyRound,
  Loader2,
  ShieldOff,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { isAdminConfigured } from '@/lib/supabase-admin'
import { PasswordInput } from '@/components/password-input'
import {
  linkEmployeeAccess,
  unlinkEmployeeAccess,
} from '../data/employees-service'
import { type Employee } from '../data/schema'

const formSchema = z.object({
  email: z.email('Email inválido.'),
  tempPassword: z.string().min(8, 'Mínimo 8 caracteres.'),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee
}

export const EmployeeAccessDialog = ({
  open,
  onOpenChange,
  employee,
}: Props) => {
  const queryClient = useQueryClient()
  const [confirmUnlink, setConfirmUnlink] = useState(false)
  const hasAccess = !!employee.authUserId

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: employee.email ?? '', tempPassword: '' },
  })

  const linkMutation = useMutation({
    mutationFn: ({ email, tempPassword }: FormValues) =>
      linkEmployeeAccess(employee.id, email, tempPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success(
        'Acceso creado. El empleado puede iniciar sesión con la contraseña temporal.'
      )
      onOpenChange(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const unlinkMutation = useMutation({
    mutationFn: () => unlinkEmployeeAccess(employee.id, employee.authUserId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Acceso eliminado correctamente.')
      setConfirmUnlink(false)
      onOpenChange(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleClose = () => {
    form.reset()
    setConfirmUnlink(false)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(s) => {
        if (!s) handleClose()
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <KeyRound className='h-4 w-4' />
            Acceso del sistema
          </DialogTitle>
          <DialogDescription>
            {employee.firstName} {employee.lastName}
          </DialogDescription>
        </DialogHeader>

        {!isAdminConfigured && (
          <Alert className='border-amber-200 bg-amber-50 dark:bg-amber-950/20'>
            <AlertTriangle className='h-4 w-4 text-amber-500' />
            <AlertDescription className='text-xs'>
              Configura{' '}
              <code className='font-mono'>VITE_SUPABASE_SERVICE_ROLE_KEY</code>{' '}
              en tu <code>.env</code> para habilitar la gestión de usuarios.
            </AlertDescription>
          </Alert>
        )}

        {hasAccess ? (
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2 rounded-lg border bg-muted/40 p-3'>
              <UserCheck className='h-4 w-4 shrink-0 text-emerald-500' />
              <p className='text-sm'>
                Este empleado ya tiene acceso al sistema.
              </p>
            </div>

            <Separator />

            {confirmUnlink ? (
              <div className='flex flex-col gap-3'>
                <p className='text-sm text-destructive'>
                  ¿Seguro? Esta acción eliminará las credenciales del empleado y
                  no podrá iniciar sesión.
                </p>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    className='flex-1'
                    onClick={() => setConfirmUnlink(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant='destructive'
                    className='flex-1'
                    disabled={unlinkMutation.isPending}
                    onClick={() => unlinkMutation.mutate()}
                  >
                    {unlinkMutation.isPending && (
                      <Loader2 className='animate-spin' />
                    )}
                    Confirmar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant='destructive'
                disabled={!isAdminConfigured}
                onClick={() => setConfirmUnlink(true)}
                className='gap-2'
              >
                <ShieldOff className='h-4 w-4' />
                Revocar acceso
              </Button>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => linkMutation.mutate(v))}
              className='flex flex-col gap-4'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de acceso</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='empleado@empresa.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tempPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña temporal</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Mínimo 8 caracteres'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className='text-[11px] text-muted-foreground'>
                      El empleado deberá cambiarla en su primer inicio de
                      sesión.
                    </p>
                  </FormItem>
                )}
              />
              <div className='flex gap-2 pt-1'>
                <Button
                  type='button'
                  variant='outline'
                  className='flex-1'
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  className='flex-1'
                  disabled={linkMutation.isPending || !isAdminConfigured}
                >
                  {linkMutation.isPending && (
                    <Loader2 className='animate-spin' />
                  )}
                  Crear acceso
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
