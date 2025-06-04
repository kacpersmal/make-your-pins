import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/shared/services/firebase.service';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreService {
  private readonly logger = new Logger(FirestoreService.name);
  private firestore: admin.firestore.Firestore;

  constructor(private readonly firebaseService: FirebaseService) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.firestore = this.firebaseService.getApp().firestore();
      this.logger.log('Firestore initialized successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Firestore',
        error instanceof Error ? error.message : String(error),
      );
      throw new Error('Firestore initialization failed');
    }
  }

  getFirestore(): admin.firestore.Firestore {
    if (!this.firestore) {
      this.logger.error('Firestore is not initialized');
      throw new Error('Firestore is not initialized');
    }
    return this.firestore;
  }
}
