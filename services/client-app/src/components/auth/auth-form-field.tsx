import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '../ui/input'
import type { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { formSchema } from './auth-formv2'
import { cn } from '@/lib/utils'

type AuthFormFieldProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>
  label: string
  description: string
  placeholder: string
  className: string
  name: 'email' | 'password'
  inputType: string
}

export default function AuthFormField({
  form,
  label,
  description,
  placeholder,
  className,
  name,
  inputType,
}: AuthFormFieldProps) {
  return (
    <div className={cn('grid gap-3', className)}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              {label}
              {inputType !== 'password' ? (
                ''
              ) : (
                <p className="ml-auto text-sm underline-offset-2 hover:underline disabled">
                  Forgot your password ?
                </p>
              )}
            </FormLabel>

            <FormControl>
              <Input placeholder={placeholder} {...field} type={inputType} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
