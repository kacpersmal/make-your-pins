import { useState } from 'react'
import { X } from 'lucide-react'
import { FileUploadStep } from './file-upload-step'
import { AssetDetailsStep } from './asset-details-step'
import type { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export function UploadForm({
  handler,
}: {
  handler: Dispatch<SetStateAction<boolean>>
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [message, setMessage] = useState<string | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const handleUploadSuccess = (fileUrl: string, fileName: string) => {
    setUploadedFileUrl(fileUrl)
    setUploadedFileName(fileName)
    setMessage('File uploaded successfully! Now add details.')
    setStep(2)
  }

  const handleError = (errorMessage: string) => {
    setMessage(errorMessage)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleComplete = () => {
    setMessage('Asset created successfully!')
    // Close the dialog after a short delay
    setTimeout(() => {
      handler(false)
    }, 1500)
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

        {message && (
          <div className="absolute left-0 right-0 top-16 mx-auto w-[90%] text-sm text-center text-muted-foreground bg-background/80 backdrop-blur-sm py-2 rounded-md">
            {message}
          </div>
        )}

        <CardContent className="grid md:grid-cols-1 place-content-center gap-0 p-0">
          {step === 1 ? (
            <FileUploadStep
              onUploadSuccess={handleUploadSuccess}
              onError={handleError}
            />
          ) : (
            <AssetDetailsStep
              uploadedFileUrl={uploadedFileUrl!}
              uploadedFileName={uploadedFileName!}
              onBack={handleBack}
              onComplete={handleComplete}
              onError={handleError}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
