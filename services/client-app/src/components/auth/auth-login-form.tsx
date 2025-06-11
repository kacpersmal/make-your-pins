import { Button } from '../ui/button'
import AuthFormField from './auth-form-field'
import AuthFormFooter from './auth-form-footer'
import AuthFormHeader from './auth-form-header'
import type { formSchema } from './auth-form'
import type { z } from 'zod'
import type { Dispatch, SetStateAction } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Form } from '@/components/ui/form'

export default function AuthLoginForm({
  hanldeRegisterFlag,
  handleSubmit,
  form,
}: {
  hanldeRegisterFlag: Dispatch<SetStateAction<boolean>>
  handleSubmit: (values: z.infer<typeof formSchema>) => void | Promise<void>
  form: UseFormReturn<z.infer<typeof formSchema>>
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex flex-col p-2 gap-6 pl-4 pr-4 mb-5 mt-5">
          <AuthFormHeader h1={'Welcome'} p={'Login to your account'} />
          <AuthFormField
            name="email"
            form={form}
            label="Email"
            placeholder="example@gmail.com"
          />
          <AuthFormField
            name="password"
            inputType="password"
            form={form}
            label="Password"
          />
          <Button
            type="submit"
            className="w-[80%] ml-auto mr-auto"
            disabled={!form.formState.isValid}
          >
            Login
          </Button>
          <AuthFormFooter hanldeRegisterFlag={hanldeRegisterFlag} />
        </div>
      </form>
    </Form>
  )
}
