import AuthFormField from './auth-form-field'
import AuthFormFooter from './auth-form-footer'
import AuthFormHeader from './auth-form-header'
import { Form } from '@/components/ui/form'
import { registerFromSchema } from './auth-form-v2'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'

export default function AuthRegisterForm({
  handleSubmit,
  form,
}: {
  handleSubmit: (
    values: z.infer<typeof registerFromSchema>,
  ) => void | Promise<void>
  form: UseFormReturn<z.infer<typeof registerFromSchema>>
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex flex-col p-2 gap-6 pl-4 pr-4 mb-10 mt-5 ">
          <AuthFormHeader h1={'Register'} p={'Create your account'} />
          <div className="">
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
              name="username"
              form={form}
              label="Username"
              description=""
              placeholder=""
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
            <AuthFormField
              name="confirm"
              inputType="password"
              form={form}
              label="Confirm Password"
              description=""
              placeholder=""
              className=""
            />
          </div>

          <Button
            type="submit"
            className="w-[80%] ml-auto mr-auto"
            disabled={!form.formState.isValid}
          >
            Register
          </Button>
        </div>
      </form>
    </Form>
  )
}
