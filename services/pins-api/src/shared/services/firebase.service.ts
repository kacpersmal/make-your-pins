import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (this.firebaseApp) {
      this.logger.log('Firebase app already initialized.');
      return;
    }

    try {
      const credentials: admin.credential.Credential =
        admin.credential.applicationDefault() as admin.credential.Credential;

      this.firebaseApp = admin.initializeApp({
        credential: credentials,
      });

      this.logger.log('Firebase app initialized successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Firebase app',
        error instanceof Error ? error.message : String(error),
      );
      throw new Error('Firebase initialization failed');
    }
  }

  getApp(): admin.app.App {
    if (!this.firebaseApp) {
      this.initializeFirebase();

      if (!this.firebaseApp) {
        throw new Error('Failed to initialize Firebase app');
      }
    }

    return this.firebaseApp;
  }
}
