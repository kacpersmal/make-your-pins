import {DefaultFirestoreService} from '../../shared/services';

export async function healthCheck() {
  const firestore = new DefaultFirestoreService();
  return {status: 'healthy', firestore: await firestore.getStatus()};
}
