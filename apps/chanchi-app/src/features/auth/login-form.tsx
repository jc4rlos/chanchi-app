import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type View = 'login' | 'forgot' | 'forgot-sent'

export const LoginForm = () => {
  const navigate = useNavigate()
  const [view, setView] = useState<View>('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (authError) {
      setError('Correo o contraseña incorrectos')
      return
    }
    navigate({ to: '/dashboard' })
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const redirectTo = `${window.location.origin}/reset-password`
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo }
    )
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    setView('forgot-sent')
  }

  if (view === 'forgot-sent') {
    return (
      <div className='flex flex-col items-center gap-3 py-4 text-center'>
        <span className='text-4xl'>📧</span>
        <p className='font-semibold text-foreground'>Revisa tu correo</p>
        <p className='text-sm text-muted'>
          Te enviamos un enlace a <strong>{email}</strong> para que puedas crear
          tu contraseña.
        </p>
        <button
          onClick={() => {
            setView('login')
            setError(null)
          }}
          className='mt-2 text-sm font-medium text-primary'
        >
          Volver al inicio de sesión
        </button>
      </div>
    )
  }

  if (view === 'forgot') {
    return (
      <form onSubmit={handleForgot} className='flex w-full flex-col gap-4'>
        <p className='text-sm text-muted'>
          Ingresa tu correo y te enviaremos un enlace para crear o restablecer
          tu contraseña.
        </p>

        <Input
          label='Correo electrónico'
          type='email'
          placeholder='tu@correo.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={16} />}
          required
          autoComplete='email'
        />

        {error && (
          <div className='bg-danger-light text-danger rounded-xl px-4 py-3 text-sm'>
            {error}
          </div>
        )}

        <Button type='submit' fullWidth loading={loading} size='lg'>
          Enviar enlace
        </Button>

        <button
          type='button'
          onClick={() => {
            setView('login')
            setError(null)
          }}
          className='text-center text-sm text-muted'
        >
          Volver al inicio de sesión
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleLogin} className='flex w-full flex-col gap-4'>
      <Input
        label='Correo electrónico'
        type='email'
        placeholder='tu@correo.com'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail size={16} />}
        required
        autoComplete='email'
      />

      <div className='relative'>
        <Input
          label='Contraseña'
          type={showPwd ? 'text' : 'password'}
          placeholder='••••••••'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={16} />}
          required
          autoComplete='current-password'
        />
        <button
          type='button'
          onClick={() => setShowPwd((v) => !v)}
          className='absolute right-3 bottom-3 text-muted'
          tabIndex={-1}
        >
          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <button
        type='button'
        onClick={() => {
          setView('forgot')
          setError(null)
        }}
        className='-mt-1 text-right text-sm font-medium text-primary'
      >
        ¿Olvidaste tu contraseña?
      </button>

      {error && (
        <div className='bg-danger-light text-danger rounded-xl px-4 py-3 text-sm'>
          {error}
        </div>
      )}

      <Button type='submit' fullWidth loading={loading} size='lg'>
        Ingresar
      </Button>
    </form>
  )
}
