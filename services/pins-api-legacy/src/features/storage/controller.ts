import {FastifyRequest, FastifyReply} from 'fastify';
import {GcsStorageService} from '../../shared/services/storage';

// Define the request body schema - only allowing contentType
interface RequestBody {
  contentType?: string;
}

export async function generateUploadUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const storageService = new GcsStorageService();
    const {contentType = 'image/jpeg'} = request.body as RequestBody;

    // Make sure user is authenticated
    if (!request.user) {
      return reply.status(401).send({error: 'Unauthorized'});
    }

    // Always generate a unique filename
    const finalFileName = storageService.generateUniqueFileName('upload');

    // Generate the signed URL
    const signedUrl = await storageService.generateSignedUrl({
      fileName: finalFileName, // The service will add /original/ prefix
      contentType,
      action: 'write',
      expires: 15 * 60, // 15 minutes
    });

    return {
      url: signedUrl,
      fileName: finalFileName,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({
      error: 'Failed to generate upload URL',
    });
  }
}
