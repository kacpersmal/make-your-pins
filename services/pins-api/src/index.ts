import fastify from 'fastify';
import cors from '@fastify/cors';

console.log('Starting Fastify server...');

const server = fastify({
  logger: process.env.NODE_ENV !== 'production',
});

server.register(cors, {
  origin: true, // Allow all origins in development, configure this for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

server.get('/health', async () => {
  return {status: 'ok'};
});

server.get('/ping', async (request, reply) => {
  return 'pong\n';
});

const start = async () => {
  try {
    // Use PORT from environment variable (Cloud Run sets this)
    const port = parseInt(process.env.PORT || '8080');

    await server.listen({
      port,
      host: '0.0.0.0', // Important for containerized environments
    });

    console.log(`Server listening on ${server.server.address().port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
