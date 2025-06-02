import {FastifyInstance} from 'fastify';
import {healthCheck, protectedEndpoint} from './controller';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', healthCheck);
  fastify.get(
    '/protected',
    {
      preHandler: [fastify.authenticate],
    },
    protectedEndpoint,
  );
}
