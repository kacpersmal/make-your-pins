import fastify from 'fastify';
import cors from '@fastify/cors';
import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
async function testFirestoreConnection() {
  try {
    // Create a test collection
    const testCollection = firestore.collection('connection_tests');

    // Create a test document
    const docRef = await testCollection.add({
      timestamp: new Date(),
      message: 'Firestore connection test',
      source: 'pins-api',
    });

    console.log('Successfully wrote to Firestore with document ID:', docRef.id);
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    throw error;
  }
}
console.log('Starting Fastify server...');

const server = fastify({
  logger: process.env.NODE_ENV !== 'production',
});

void server.register(cors, {
  origin: true, // Allow all origins in development, configure this for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

server.get('/health', async () => {
  return {status: 'ok'};
});

server.get('/ping', async (request, reply) => {
  await testFirestoreConnection();
  return 'pong 2\n';
});

const start = async () => {
  try {
    // Use PORT from environment variable (Cloud Run sets this)
    const port = parseInt(process.env.PORT || '8080');

    await server.listen({
      port,
      host: '0.0.0.0', // Important for containerized environments
    });

    if (server && server.server) {
      server.log.info(
        `Server is running on port ${server?.server?.address()?.toString() || port}`,
      );
    } else {
      server.log.error('Server instance is not available');
    }
  } catch (err) {
    server.log.error(err);
    throw err;
  }
};

// Fix the ESLint error by adding a catch handler to the Promise
start().catch(err => {
  console.error('Failed to start server:', err);
  throw err;
});
