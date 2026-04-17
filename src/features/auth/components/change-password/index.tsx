import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@boilerplate/ui'
import { AuthLayout } from '../../layout/auth-layout'
import { ChangePasswordForm } from './components/change-password-form'

export function ChangePassword() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Cambiar contraseña
          </CardTitle>
          <CardDescription>
            Por seguridad, debes establecer una nueva contraseña antes de
            continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
