import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/demo/upload')({
  component: UploadDemo,
})

function UploadDemo() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { currentUser } = useAuth()

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    setUploadedFileUrl(null)
  }

  // Replace the existing fetch implementation with this XMLHttpRequest version
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    if (!currentUser) {
      setError('You must be logged in to upload files')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)
      setError(null)

      // Step 1: Get a signed URL from our API (using fetch)
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

      const { url: signedUrl, publicUrl } = await uploadUrlResponse.json()
      console.log('Signed URL:', signedUrl)
      console.log('File type:', file.type)
      console.log('File size:', file.size)

      // Step 2: Upload the file to the signed URL using XMLHttpRequest
      // to track progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        // Set up progress tracking
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total,
            )
            setUploadProgress(percentCompleted)
          }
        })

        // Set up completion handler
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        })

        // Set up error handler
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'))
        })

        // Set up the request
        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        // xhr.setRequestHeader('Content-Length', file.size.toString())
        // Send the file
        xhr.send(file)
      })

      // Step 3: Get the public URL for the uploaded file
      setUploadedFileUrl(publicUrl)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">File Upload Demo</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload a File</h2>

        {!currentUser && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
            Please log in to upload files.
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select File</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isUploading}
          />
        </div>

        {file && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="font-medium">Selected File:</p>
            <p>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-md">
            {error}
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

        <button
          onClick={handleUpload}
          disabled={!file || isUploading || !currentUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      {uploadedFileUrl && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Complete!</h2>
          <p className="mb-2">File has been uploaded successfully.</p>

          {uploadedFileUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
            <div className="mt-4">
              <p className="mb-2">Preview:</p>
              <img
                src={uploadedFileUrl}
                alt="Uploaded file"
                className="max-w-full h-auto max-h-96 rounded-lg border dark:border-gray-700"
              />
            </div>
          ) : (
            <p className="mt-4">
              <a
                href={uploadedFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                View uploaded file
              </a>
            </p>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Client requests a signed URL from the server</li>
          <li>
            Server generates a signed URL that allows direct upload to Google
            Cloud Storage
          </li>
          <li>
            Client uploads the file directly to Google Cloud Storage using the
            signed URL
          </li>
          <li>
            The thumbnail generator Cloud Function is triggered to process the
            uploaded file
          </li>
        </ol>
      </div>
    </div>
  )
}
