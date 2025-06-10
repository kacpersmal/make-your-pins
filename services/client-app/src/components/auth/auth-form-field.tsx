import { Input } from '../ui/input'
import type { Path, UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

// TSchema is a generic type parameter.
// It must be an object type (a record with string keys and any values).
// This allows you to use this type with any form schema (login, register, etc.).

// extends Record<string, any> means:
// TSchema must be an object type with string keys and any values.

// What is Path from react-hook-form?
// Path<T> is a TypeScript utility type provided by react-hook-form.
// It represents all possible string paths (field names) in your form schema T.
// It supports not just top-level keys, but also nested keys (like "user.email" if your schema is nested).

type AuthFormFieldProps<TSchema extends Record<string, any>> = {
  form: UseFormReturn<TSchema>
  label: string
  name: Path<TSchema>
  description?: string
  placeholder?: string
  className?: string
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
}
export default function AuthFormField<TSchema extends Record<string, any>>({
  form,
  label,
  description = '',
  placeholder = '',
  className = '',
  name,
  inputType = 'text',
}: AuthFormFieldProps<TSchema>) {
  return (
    <div className={cn('grid gap-3', className)}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">{label}</FormLabel>

            <FormControl>
              <Input placeholder={placeholder} {...field} type={inputType} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
