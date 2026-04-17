import { Link, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@boilerplate/ui'
import { AuthLayout } from '../../layout/auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Iniciar sesión
          </CardTitle>
          <CardDescription>
            Ingresa tu correo y contraseña para acceder al sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <Link
            to='/forgot-password'
            className='mx-auto text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline'
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
