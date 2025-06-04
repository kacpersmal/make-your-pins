import fastify, {FastifyInstance} from 'fastify';
import cors from '@fastify/cors';
import {config} from './config';

import {healthRoutes} from '../features/health';
import authPlugin from '../shared/plugins/firebase-auth.plugin';
import {storageRoutes} from '../features/storage';

export async function buildApp(): Promise<Promise<FastifyInstance>> {
  const server = fastify({
    logger: config.server.logger,
  });

  // Register plugins
  void server.register(cors, config.cors);
  void server.register(authPlugin);
  void server.register(import('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Pins API',
        description: 'API for Make Your Pins application',
        version: '1.0.0',
      },
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter your bearer token in the format "Bearer {token}"',
        },
      },
    },
  });
  void server.register(import('@fastify/swagger-ui'), {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
      persistAuthorization: true,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: header => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
  // Register routes
  void server.register(healthRoutes);
  void server.register(storageRoutes, {prefix: '/storage'});

  return server;
}
