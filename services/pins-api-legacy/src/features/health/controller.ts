import {FastifyRequest} from 'fastify';
import {DefaultFirestoreService} from '../../shared/services/firestore';

export async function healthCheck() {
  const firestore = new DefaultFirestoreService();
  return {status: 'healthy', firestore: await firestore.getStatus()};
}

export async function protectedEndpoint(request: FastifyRequest) {
  // The user is available in request.user thanks to the auth middleware
  return {
    message: 'This is a protected endpoint',
    user: {
      uid: request.user?.uid,
      email: request.user?.email,
    },
  };
}
