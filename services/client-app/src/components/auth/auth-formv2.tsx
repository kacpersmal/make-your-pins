import React, { useState } from 'react'
import { useAuth } from '../../lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import AuthFormHeader from './auth-form-header'
import AuthFormSide from './auth-form-side'
import AuthFormField from './auth-form-field'
import AuthFormFooter from './auth-form-footer'
export const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be minimum 6 characters' })
    .max(12, { message: 'Password cannot be longer than 12 characters' }),
})

export function AuthForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <Card className="overflow-hidden min-h-96 p-0 shadow-2xl/80">
      <CardContent className="grid p-0 h-full md:grid-cols-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Main content with input fields for login proces */}
            <div className="flex flex-col p-2 gap-6 pl-4 pr-4 mb-5 mt-5">
              <AuthFormHeader />
              <AuthFormField
                name="email"
                form={form}
                label="Email"
                description=""
                placeholder="example@gmail.com"
                className=""
                inputType=""
              />
              <AuthFormField
                name="password"
                inputType="password"
                form={form}
                label="Password"
                description=""
                placeholder=""
                className=""
              />
              <Button type="submit" className="w-[80%] ml-auto mr-auto">
                Login
              </Button>
              {/* FOOTER */}
              <AuthFormFooter />
            </div>
          </form>
        </Form>
        <AuthFormSide />
      </CardContent>
    </Card>
  )
}
