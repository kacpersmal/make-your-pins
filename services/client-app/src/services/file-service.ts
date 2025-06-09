import apiClient from '../lib/api-client'
import type { UserUploadUrl } from '../types/file-types'

export class FileService {
  private baseUrl = '/files'

  // Get signed URL for file upload
  async getUploadUrl(
    contentType: string = 'image/jpeg',
  ): Promise<UserUploadUrl> {
    return apiClient.post<UserUploadUrl>(`${this.baseUrl}/upload-url`, {
      contentType,
    })
  }

  // Upload a file using the signed URL
  async uploadFile(file: File): Promise<{ fileName: string; url: string }> {
    // Get a signed URL
    const { url: signedUrl, fileName } = await this.getUploadUrl(file.type)

    // Upload directly to the signed URL
    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('File upload failed')
    }

    return {
      fileName,
      url: signedUrl.split('?')[0], // Remove query params to get the base URL
    }
  }
}

export const fileService = new FileService()
