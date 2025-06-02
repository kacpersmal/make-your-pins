import {FastifyInstance} from 'fastify';
import {healthCheck, ping} from './controller';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', healthCheck);
  fastify.get('/ping', ping);
}
