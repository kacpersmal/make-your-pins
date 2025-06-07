'use client'
import { Card, CardContent } from '@/components/ui/card'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import AuthLoginForm from './auth-login-form'
import AuthRegisterForm from './auth-register-form'

import AuthFormSide from './auth-form-side'
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
      .min(5, { message: 'Username must be minimum 6 characters' })
      .max(20, { message: 'Username cannot be longer than 12 characters' }),
    password: z
      .string()
      .min(6, { message: 'Password must be minimum 6 characters' })
      .max(12, { message: 'Password cannot be longer than 12 characters' }),

    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords doesn't match",
    path: ['confirm'],
  })

export function AuthFormV2() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const registerForm = useForm<z.infer<typeof registerFromSchema>>({
    resolver: zodResolver(registerFromSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirm: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {}

  return (
    <>
      <Card className="overflow-hidden min-h-96 p-0 shadow-2xl/80">
        <CardContent className="grid p-0 h-full md:grid-cols-2">
          <AuthLoginForm handleSubmit={onSubmit} form={form} />
          {/* <AuthRegisterForm handleSubmit={onSubmit} form={registerForm} /> */}
          <AuthFormSide />
        </CardContent>
      </Card>
    </>
  )
}
