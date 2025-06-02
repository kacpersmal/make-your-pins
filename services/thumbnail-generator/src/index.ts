import * as functions from '@google-cloud/functions-framework';
import {CloudEvent} from '@google-cloud/functions-framework';
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
      source: 'thumbnail-generator',
    });

    console.log('Successfully wrote to Firestore with document ID:', docRef.id);
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    throw error;
  }
}

// Define interface for file object in Cloud Storage events
interface StorageObjectData {
  bucket: string;
  name: string;
  contentType?: string;
  size?: string;
  generation?: string;
  metageneration?: string;
  timeCreated?: string;
  updated?: string;
  metadata?: Record<string, string>;
}

// Create a storage client

/**
 * Cloud Function triggered by Cloud Storage when a file is uploaded
 *
 * @param {CloudEvent} cloudEvent The CloudEvent from Cloud Storage
 */
functions.cloudEvent(
  'processUploadedFile',
  async (cloudEvent: CloudEvent<StorageObjectData>) => {
    try {
      console.log('IT WORKS');
      // Log event information
      console.log('Event ID:', cloudEvent.id);
      console.log('Event Type:', cloudEvent.type);
      await testFirestoreConnection();
      // Get file information from the event
      const file = cloudEvent.data;
      if (!file) {
        throw new Error('No file data in event');
      }

      console.log('Bucket:', file.bucket);
      console.log('File:', file.name);
      console.log('Metadata:', file.metadata || {});

      // Here you would add your thumbnail generation logic
      console.log('Processing file:', file.name);

      return Promise.resolve();
    } catch (error) {
      console.error('Error processing file:', error);
      return Promise.reject(error);
    }
  }
);
