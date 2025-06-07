import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (this.firebaseApp) {
      this.logger.log('Firebase app already initialized.');
      return;
    }

    try {
      // Determine environment
      const isLocalDev =
        this.configService.get<string>('NODE_ENV') === 'development';

      let credential: admin.credential.Credential;

      if (isLocalDev) {
        // For local development, use the service account file
        const credentialsPath = this.configService.get<string>(
          'GOOGLE_APPLICATION_CREDENTIALS',
        );

        if (credentialsPath) {
          this.logger.log(
            `Initializing Firebase with service account from: ${credentialsPath}`,
          );

          // Check if file exists
          if (!fs.existsSync(credentialsPath)) {
            throw new Error(
              `Firebase credentials file not found at: ${credentialsPath}`,
            );
          }

          // Parse service account
          try {
            const serviceAccount = JSON.parse(
              fs.readFileSync(credentialsPath, 'utf8'),
            );
            credential = admin.credential.cert(serviceAccount);
          } catch (error) {
            throw new Error(`Invalid service account format: ${error.message}`);
          }
        } else {
          this.logger.warn(
            'GOOGLE_APPLICATION_CREDENTIALS not set, falling back to application default',
          );
          credential = admin.credential.applicationDefault();
        }
      } else {
        // For Cloud Run or other GCP environments, use application default credentials
        this.logger.log(
          'Initializing Firebase with application default credentials',
        );
        credential = admin.credential.applicationDefault();
      }

      // Get project ID
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');

      // Initialize the app
      this.firebaseApp = admin.initializeApp({
        credential,
        projectId: projectId,
      });

      this.logger.log('Firebase app initialized successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Firebase app',
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(`Firebase initialization failed: ${error.message}`);
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
