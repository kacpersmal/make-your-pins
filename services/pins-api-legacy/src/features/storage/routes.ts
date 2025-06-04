import {FastifyInstance} from 'fastify';
import {generateUploadUrl} from './controller';

export async function storageRoutes(fastify: FastifyInstance) {
  // Protected endpoint to generate upload URLs
  fastify.post(
    '/upload-url',
    {
      preHandler: [fastify.authenticate],
      schema: {
        security: [{bearerAuth: []}],
        body: {
          type: 'object',
          properties: {
            contentType: {type: 'string'},
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              url: {type: 'string'},
              fileName: {type: 'string'},
              expiresIn: {type: 'number'},
            },
            required: ['url', 'fileName', 'expiresIn'],
          },
        },
      },
    },
    generateUploadUrl,
  );
}
