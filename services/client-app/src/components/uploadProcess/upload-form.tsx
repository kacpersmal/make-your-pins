import React, { useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function UploadForm({
  handler,
}: {
  handler: Dispatch<SetStateAction<boolean>>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const dropRef = useRef<HTMLDivElement>(null)

  const handleFile = (file: File) => {
    setFile(file)
    setMessage('')
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please select or drop a file.')
      return
    }

    console.log('Uploading:', { file, description })
    setMessage('File uploaded successfully (simulated).')
    setFile(null)
    setPreview(null)
    setDescription('')
  }

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
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 flex flex-col gap-6"
          >
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
              {file ? (
                <p>{file.name}</p>
              ) : (
                <p>Drop file here or click to select</p>
              )}
              <Input
                type="file"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Say something about this file..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

            <Button type="submit" className="w-full">
              Upload
            </Button>

            {message && (
              <div className="text-sm text-center text-muted-foreground">
                {message}
              </div>
            )}
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1612832020803-748b8a0aa0ae?q=80&w=2000&auto=format&fit=crop"
              alt="Upload illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UploadForm
