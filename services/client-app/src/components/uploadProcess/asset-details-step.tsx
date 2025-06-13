import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { assetFormSchema } from './upload-form-schema'
import { TagSuggestions } from './tag-suggestions'
import type { AssetFormValues } from './upload-form-schema'
import type { AssetTag } from '@/types/asset-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateAsset } from '@/hooks/use-assets'
import { AssetFileType } from '@/types/asset-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface AssetDetailsStepProps {
  uploadedFileUrl: string
  uploadedFileName: string
  onBack: () => void
  onComplete: () => void
  onError: (message: string) => void
}

export function AssetDetailsStep({
  uploadedFileUrl,
  uploadedFileName,
  onBack,
  onComplete,
  onError,
}: AssetDetailsStepProps) {
  const createAsset = useCreateAsset()
  const [currentTags, setCurrentTags] = useState<Array<string>>([])
  const [tagSearchQuery, setTagSearchQuery] = useState<string>('')

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: '',
    },
  })

  const handleAddTag = (newTag: string) => {
    const currentTagsValue = form.getValues('tags') || ''
    const tagsArray = currentTagsValue
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    // Only add if not already present
    if (!tagsArray.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
      const updatedTags = [...tagsArray, newTag].join(', ')
      form.setValue('tags', updatedTags, { shouldValidate: true })
      setCurrentTags([...tagsArray, newTag])

      // Clear search query after adding a tag
      setTagSearchQuery('')
    }
  }

  const onSubmit = async (data: AssetFormValues) => {
    try {
      // Parse tags from comma-separated string
      const assetTags: Array<AssetTag> = data.tags
        ? data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .map((tag) => ({ value: tag }))
        : []

      // Create the asset
      await createAsset.mutateAsync({
        name: data.name,
        description: data.description || '',
        files: [
          {
            fileName: uploadedFileName,
            type: AssetFileType.IMAGE,
            order: 0,
            path: uploadedFileUrl,
          },
        ],
        tags: assetTags.length > 0 ? assetTags : undefined,
      })

      onComplete()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create asset')
      console.error('Create asset error:', err)
    }
  }

  // Handle tag input changes
  const handleTagsChange = (value: string) => {
    // Update form value first
    const lastCommaIndex = value.lastIndexOf(',')

    // Extract the search query (text after the last comma)
    if (lastCommaIndex !== -1) {
      const search = value.substring(lastCommaIndex + 1).trim()
      setTagSearchQuery(search)
    } else {
      setTagSearchQuery(value.trim())
    }

    // Update current tags list
    const tagsArray = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    setCurrentTags(tagsArray)
    return value
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-6 md:p-8 flex flex-col gap-6"
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Create Asset</h1>
          <p className="text-muted-foreground">
            Add details for your uploaded file
          </p>
        </div>

        {uploadedFileUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={uploadedFileUrl}
              alt="Uploaded"
              className="max-h-48 rounded-lg shadow"
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Give your asset a name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your asset" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="nature, landscape, mountains"
                  {...field}
                  onChange={(e) => {
                    field.onChange(handleTagsChange(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
              <TagSuggestions
                currentTags={currentTags}
                searchQuery={tagSearchQuery}
                onAddTag={handleAddTag}
              />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={createAsset.isPending}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!form.formState.isValid || createAsset.isPending}
          >
            {createAsset.isPending ? 'Creating...' : 'Complete'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
