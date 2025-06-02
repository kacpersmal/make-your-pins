import fastify, {FastifyInstance} from 'fastify';
import cors from '@fastify/cors';
import {config} from './config';

import {healthRoutes} from '../features/health';
import authPlugin from '../shared/plugins/firebase-auth.plugin';

export function buildApp(): FastifyInstance {
  const server = fastify({
    logger: config.server.logger,
  });

  // Register plugins
  void server.register(cors, config.cors);
  void server.register(authPlugin);

  // Register routes
  void server.register(healthRoutes);

  return server;
}
