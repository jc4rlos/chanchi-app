import { z } from 'zod'

export const formSchema = z.object({
  email: z.email('Ingresa un email válido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
})

export type FormValues = z.infer<typeof formSchema>
