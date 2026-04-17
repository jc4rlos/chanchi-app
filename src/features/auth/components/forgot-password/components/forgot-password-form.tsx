import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
} from '@boilerplate/ui'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { sendPasswordResetEmail } from '../../../auth-service'

const formSchema = z.object({
  email: z.email('Ingresa un email válido.'),
})

type FormValues = z.infer<typeof formSchema>

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit({ email }: FormValues) {
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(email)
      setSent(true)
      toast.success(`Enlace enviado a ${email}`)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al enviar el enlace.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <p className='text-center text-sm text-muted-foreground'>
        Revisa tu bandeja de entrada. Haz clic en el enlace para restablecer tu
        contraseña.
      </p>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='tu@email.com'
                  type='email'
                  autoComplete='email'
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
            <ArrowRight size={16} />
          )}
          Enviar enlace
        </Button>
      </form>
    </Form>
  )
}
