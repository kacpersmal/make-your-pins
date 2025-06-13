import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { AssetTag } from '@/types/asset-types'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useCreateAsset } from '@/hooks/use-assets'
import { AssetFileType } from '@/types/asset-types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export function UploadForm({
  handler,
}: {
  handler: Dispatch<SetStateAction<boolean>>
}) {
  // State for both steps
  const [step, setStep] = useState<1 | 2>(1)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string>('')
  const [message, setMessage] = useState<string | null>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const dropRef = useRef<HTMLInputElement>(null)

  const { currentUser } = useAuth()
  const createAsset = useCreateAsset()

  const handleFile = (ufile: File) => {
    setFile(ufile)
    setMessage('')
    if (ufile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(ufile)
    } else {
      setPreview(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    dropRef.current?.classList.add('border-primary')
  }

  const handleDragLeave = () => {
    dropRef.current?.classList.remove('border-primary')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dropRef.current?.classList.remove('border-primary')
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFile(selectedFile)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please select or drop a file.')
      return
    }

    if (!currentUser) {
      setMessage('You must be logged in to upload files')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)
      setMessage(null)

      const tokenResponse = await currentUser.getIdToken()

      const uploadUrlResponse = await fetch(`${API_URL}/files/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenResponse}`,
        },
        body: JSON.stringify({
          contentType: file.type,
        }),
      })

      if (!uploadUrlResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const {
        url: signedUrl,
        publicUrl,
        fileName,
      } = await uploadUrlResponse.json()

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total,
            )
            setUploadProgress(percentCompleted)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'))
        })

        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', file.type)

        xhr.send(file)
      })

      setUploadedFileUrl(publicUrl)
      setUploadedFileName(fileName)
      setMessage('File uploaded successfully! Now add details.')

      // Move to step 2
      setStep(2)
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : 'An unknown error occurred',
      )
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadedFileName || !uploadedFileUrl) {
      setMessage('Please upload a file first')
      return
    }

    if (!name) {
      setMessage('Please provide a name for your asset')
      return
    }

    try {
      setMessage('Creating asset...')

      // Parse tags from comma-separated string
      const assetTags: Array<AssetTag> = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map((tag) => ({ value: tag }))

      // Create the asset
      await createAsset.mutateAsync({
        name,
        description,
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

      setMessage('Asset created successfully!')

      // Close the dialog after a short delay
      setTimeout(() => {
        handler(false)
      }, 1500)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to create asset')
      console.error('Create asset error:', err)
    }
  }

  // Render step 1 - File Upload
  const renderStepOne = () => (
    <form onSubmit={handleUpload} className="p-6 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Upload File</h1>
        <p className="text-muted-foreground">
          Drag and drop a file or use the picker
        </p>
      </div>

      <div
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary"
      >
        {file ? <p>{file.name}</p> : <p>Drop file here or click to select</p>}
        <Input
          type="file"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded-lg shadow"
          />
        </div>
      )}

      {isUploading && (
        <div className="mb-4">
          <p className="mb-2">Uploading: {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {message && (
        <div className="text-sm text-center text-muted-foreground">
          {message}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!file || isUploading || !currentUser}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </form>
  )

  // Render step 2 - Create Asset
  const renderStepTwo = () => (
    <form
      onSubmit={handleCreateAsset}
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

      <div className="grid gap-3">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="Give your asset a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your asset"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          placeholder="nature, landscape, mountains"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {message && (
        <div className="text-sm text-center text-muted-foreground">
          {message}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setStep(1)}
          disabled={createAsset.isPending}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!name || createAsset.isPending}
        >
          {createAsset.isPending ? 'Creating...' : 'Complete'}
        </Button>
      </div>
    </form>
  )

  return (
    <div className={cn('flex h-full w-full items-center justify-center')}>
      <Card className="w-full max-w-3xl shadow-2xl relative">
        <button
          type="button"
          onClick={() => {
            handler(false)
          }}
          className="absolute right-4 top-4 z-10 text-muted-foreground hover:text-foreground"
        >
          <X className="h-6 w-6" />
        </button>

        <CardContent className="grid md:grid-cols-1 place-content-center gap-0 p-0">
          {step === 1 ? renderStepOne() : renderStepTwo()}
        </CardContent>
      </Card>
    </div>
  )
}
