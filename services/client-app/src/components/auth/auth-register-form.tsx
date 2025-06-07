import AuthFormField from './auth-form-field'
import AuthFormHeader from './auth-form-header'
import { Form } from '@/components/ui/form'
import { registerFromSchema } from './auth-form-v2'
import type { UseFormReturn } from 'react-hook-form'
import type { Dispatch, SetStateAction } from 'react'
import { z } from 'zod'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function AuthRegisterForm({
  hanldeRegisterFlag,

  form,
}: {
  hanldeRegisterFlag: Dispatch<SetStateAction<boolean>>
  form: UseFormReturn<z.infer<typeof registerFromSchema>>
}) {
  const { signUp } = useAuth()
  const [error, setError] = useState('')
  const handleRegisterSubmit = async (
    values: z.infer<typeof registerFromSchema>,
  ) => {
    setError('')
    try {
      await signUp(values.email, values.password)
    } catch (err) {
      setError('Failed to create an account.')
      console.error(err)
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegisterSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col p-2 gap-6 pl-4 pr-4 mb-10 mt-5 ">
          <AuthFormHeader h1={'Register'} p={'Create your account'} />
          <div className="">
            <AuthFormField
              name="email"
              form={form}
              label="Email"
              description=""
              placeholder="example@gmail.com"
            />
            <AuthFormField name="username" form={form} label="Username" />
            <AuthFormField
              name="password"
              inputType="password"
              form={form}
              label="Password"
            />
            <AuthFormField
              name="confirm"
              inputType="password"
              form={form}
              label="Confirm Password"
            />
          </div>

          <Button
            type="submit"
            className="w-[80%] ml-auto mr-auto"
            disabled={!form.formState.isValid}
          >
            Register
          </Button>

          <div className="text-center text-sm">
            Have an account?
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault()
                hanldeRegisterFlag(false)
              }}
            >
              Log in
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
