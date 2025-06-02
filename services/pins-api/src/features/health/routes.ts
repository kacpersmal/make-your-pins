import {FastifyInstance} from 'fastify';
import {healthCheck} from './controller';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', healthCheck);
}
