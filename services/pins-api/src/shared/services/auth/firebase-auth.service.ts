import * as admin from 'firebase-admin';
import {ServiceAccount} from 'firebase-admin';
import {FirebaseUser} from './firebase-auth.service.dto';

export interface AuthService {
  verifyToken(token: string): Promise<FirebaseUser>;
  getUser(uid: string): Promise<admin.auth.UserRecord>;
}

export class FirebaseAuthService implements AuthService {
  private readonly auth: admin.auth.Auth;

  constructor() {
    if (!admin.apps.length) {
      // If using environment variables
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(
          process.env.FIREBASE_SERVICE_ACCOUNT,
        ) as ServiceAccount;

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
      // If using a service account file
      else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
    }

    this.auth = admin.auth();
  }

  async verifyToken(token: string): Promise<FirebaseUser> {
    try {
      return await this.auth.verifyIdToken(token);
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      throw new Error('Invalid or expired authentication token');
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await this.auth.getUser(uid);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('User not found');
    }
  }
}
