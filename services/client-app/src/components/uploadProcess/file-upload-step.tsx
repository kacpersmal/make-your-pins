import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/auth-context'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface FileUploadStepProps {
  onUploadSuccess: (fileUrl: string, fileName: string) => void
  onError: (message: string) => void
}

export function FileUploadStep({
  onUploadSuccess,
  onError,
}: FileUploadStepProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const dropRef = useRef<HTMLInputElement>(null)
  const { currentUser } = useAuth()

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile)

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
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
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
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
      onError('Please select or drop a file.')
      return
    }

    if (!currentUser) {
      onError('You must be logged in to upload files')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

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

      onUploadSuccess(publicUrl, fileName)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
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
          <Progress value={uploadProgress} className="h-2" />
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
}
