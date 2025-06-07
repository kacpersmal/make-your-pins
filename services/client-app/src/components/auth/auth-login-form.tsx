import AuthFormField from './auth-form-field'
import AuthFormFooter from './auth-form-footer'
import AuthFormHeader from './auth-form-header'
import { Form } from '@/components/ui/form'
import { formSchema } from './auth-form-v2'

import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'

export default function AuthLoginForm({
  handleSubmit,
  form,
}: {
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
          <Button
            type="submit"
            className="w-[80%] ml-auto mr-auto"
            disabled={!form.formState.isValid}
          >
            Login
          </Button>
          <AuthFormFooter />
        </div>
      </form>
    </Form>
  )
}
