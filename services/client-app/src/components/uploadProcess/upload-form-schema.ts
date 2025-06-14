import { z } from 'zod'

export const assetFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  description: z
    .string()
    .max(500, { message: 'Description cannot exceed 500 characters' })
    .optional(),
  tags: z.string().optional(),
})

export type AssetFormValues = z.infer<typeof assetFormSchema>
