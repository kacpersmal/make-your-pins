import fastify, {FastifyInstance} from 'fastify';
import cors from '@fastify/cors';
import {config} from './config';

import {healthRoutes} from '../features/health';

export function buildApp(): FastifyInstance {
  const server = fastify({
    logger: config.server.logger,
  });

  // Register plugins
  void server.register(cors, config.cors);

  // Register routes
  void server.register(healthRoutes);

  return server;
}
