import { z } from 'zod'
export const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Must Be at least 2 characters' })
    .max(50),
})
