import {FastifyRequest, FastifyReply} from 'fastify';
import {DefaultFirestoreService} from '../../shared/services';

export async function healthCheck() {
  const firestore = new DefaultFirestoreService();
  return {status: 'healthy', firestore: await firestore.getStatus()};
}

export async function ping(request: FastifyRequest, reply: FastifyReply) {
  return 'pong \n';
}
