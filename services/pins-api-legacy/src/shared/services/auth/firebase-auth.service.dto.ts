import * as admin from 'firebase-admin';

// Firebase user with additional properties

export type FirebaseUser = admin.auth.DecodedIdToken;
