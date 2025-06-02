import {FastifyInstance, FastifyPluginAsync, FastifyRequest} from 'fastify';
import fp from 'fastify-plugin';
import {FirebaseUser, AuthService, FirebaseAuthService} from '../services/auth';

// Extend FastifyRequest to include the user
declare module 'fastify' {
  interface FastifyRequest {
    user?: FirebaseUser;
  }

  // Extend the instance to have the auth service
  interface FastifyInstance {
    auth: AuthService;
    authenticate: (request: FastifyRequest, reply: any) => Promise<void>;
  }
}

// Convert to FastifyPluginAsync and don't use done callback
const authPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Create auth service instance
  const authService = new FirebaseAuthService();

  // Add the service to Fastify instance
  fastify.decorate('auth', authService);

  // Add authentication decorator
  fastify.decorate('authenticate', async (request: FastifyRequest, reply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({error: 'Authentication required'});
        return;
      }

      const token = authHeader.split(' ')[1];
      const user = await authService.verifyToken(token);

      // Attach the user to the request
      request.user = user;
    } catch (error) {
      reply.status(401).send({error: 'Invalid authentication token'});
    }
  });
};

export default fp(authPlugin, {
  name: 'authentication',
});
