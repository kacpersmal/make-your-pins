import { useMutation } from '@tanstack/react-query'
import { fileService } from '../services/file-service'

// Hook for file uploads
export function useFileUpload() {
  return useMutation({
    mutationFn: (file: File) => fileService.uploadFile(file),
  })
}
