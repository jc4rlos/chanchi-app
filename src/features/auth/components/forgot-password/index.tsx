import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@boilerplate/ui'
import { AuthLayout } from '../../layout/auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

export function ForgotPassword() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Recuperar contraseña
          </CardTitle>
          <CardDescription>
            Ingresa tu correo registrado y te enviaremos un enlace para
            restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter>
          <Link
            to='/sign-in'
            className='mx-auto text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline'
          >
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
