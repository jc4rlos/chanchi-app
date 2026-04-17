import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@boilerplate/ui'
import { KeyRound, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { PasswordInput } from '@/components/password-input'
import { updatePassword, getEmployeeByUserId } from '../../../auth-service'

const formSchema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres.'),
    confirm: z.string().min(1, 'Confirma la contraseña.'),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirm'],
  })

type FormValues = z.infer<typeof formSchema>

export function ChangePasswordForm({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirm: '' },
  })

  async function onSubmit({ password }: FormValues) {
    setIsLoading(true)
    try {
      await updatePassword(password)

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error('Sesión no encontrada.')

      const employee = await getEmployeeByUserId(session.user.id)
      auth.setUser({
        employeeId: employee.id,
        email: session.user.email ?? '',
        role: employee.role,
        exp: (session.expires_at ?? 0) * 1000,
      })
      auth.setAccessToken(session.access_token)

      toast.success('Contraseña actualizada. Bienvenido.')
      navigate({ to: '/', replace: true })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al cambiar la contraseña.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
      >
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Mínimo 8 caracteres'
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirm'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Repite la contraseña'
                  autoComplete='new-password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? (
            <Loader2 className='animate-spin' />
          ) : (
            <KeyRound size={16} />
          )}
          Cambiar contraseña
        </Button>
      </form>
    </Form>
  )
}
