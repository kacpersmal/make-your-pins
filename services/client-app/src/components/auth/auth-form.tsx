'use client'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import AuthLoginForm from './auth-login-form'
import AuthRegisterForm from './auth-register-form'
import AuthFormSide from './auth-form-side'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'

export const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be minimum 6 characters' })
    .max(12, { message: 'Password cannot be longer than 12 characters' }),
})
export const registerFromSchema = z
  .object({
    email: z.string().email(),
    username: z
      .string()
      .min(6, { message: 'Username must be minimum 6 characters' })
      .max(20, { message: 'Username cannot be longer than 12 characters' }),
    password: z
      .string()
      .min(6, { message: 'Password must be minimum 6 characters' })
      .max(12, { message: 'Password cannot be longer than 12 characters' }),

    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

export function AuthForm() {
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const [registerFlag, setRegisterFlag] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const registerForm = useForm<z.infer<typeof registerFromSchema>>({
    resolver: zodResolver(registerFromSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirm: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signIn(values.email, values.password)
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.')
      console.error(err)
      console.error(error)
    }
  }

  return (
    <>
      <Card className="overflow-hidden h-full p-0 shadow-2xl/80">
        <CardContent className="grid p-0  h-full md:grid-cols-2">
          {!registerFlag ? (
            <AnimatePresence>
              <motion.div
                className="mb-auto mt-auto p-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <AuthLoginForm
                  hanldeRegisterFlag={setRegisterFlag}
                  handleSubmit={onSubmit}
                  form={form}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="mb-auto mt-auto p-6"
            >
              <AuthRegisterForm
                handleRegisterFlag={setRegisterFlag}
                form={registerForm}
              />
            </motion.div>
          )}

          {/* <AuthLoginForm handleSubmit={onSubmit} form={form} /> */}
          <AuthFormSide />
        </CardContent>
      </Card>
    </>
  )
}
