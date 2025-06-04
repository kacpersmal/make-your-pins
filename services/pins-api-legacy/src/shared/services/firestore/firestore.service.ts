import {Firestore} from '@google-cloud/firestore';
import {FirestoreStatus} from './firestore.service.dto';

export interface FirestoreService {
  getClient(): Firestore;
  testConnection(): Promise<boolean>;
}

export class DefaultFirestoreService implements FirestoreService {
  private client: Firestore;

  constructor() {
    this.client = new Firestore();
  }
  testConnection(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getClient(): Firestore {
    return this.client;
  }

  async getStatus(): Promise<FirestoreStatus> {
    try {
      const doc = this.client.doc('health/status');
      await doc.get();
    } catch (error) {
      console.error('Error connecting to Firestore:', error);
      return 'unhealthy';
    }
    return 'healthy';
  }
}
