import * as functions from '@google-cloud/functions-framework';
import {CloudEvent} from '@google-cloud/functions-framework';
import {Firestore} from '@google-cloud/firestore';
import {Storage} from '@google-cloud/storage';
import * as sharp from 'sharp';
import * as path from 'path';

const firestore = new Firestore();
const storage = new Storage();

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

/**
 * Generate thumbnail file name from original file name
 * @param fileName Original file name
 * @returns Thumbnail file name
 */
function getThumbnailName(fileName: string): string {
  // More robust regex that handles various file extensions
  const withThumbnail = fileName.replace(/(\.[^.\\/]+)$/, '-thumbnail$1');

  // Fallback if regex didn't work (no extension or regex failed)
  if (withThumbnail === fileName) {
    return `${fileName}-thumbnail`;
  }

  return withThumbnail;
}

/**
 * Extract user ID from file path
 * Pattern: users/{userId}/{fileName}
 * @param filePath File path in storage
 * @returns User ID or null if not found
 */
function extractUserIdFromPath(filePath: string): string | null {
  const parts = filePath.split('/');
  if (parts.length >= 2 && parts[0] === 'users') {
    return parts[1];
  }
  return null;
}

/**
 * Check if file is an image based on content type
 * @param contentType Content type of the file
 * @returns True if file is an image
 */
function isImage(contentType?: string): boolean {
  return !!contentType && contentType.startsWith('image/');
}

/**
 * Generate thumbnail for an image
 * @param inputBuffer Original image buffer
 * @param maxWidth Maximum width of thumbnail
 * @param maxHeight Maximum height of thumbnail
 * @returns Processed image buffer
 */
async function generateThumbnail(
  inputBuffer: Buffer,
  maxWidth = 300,
  maxHeight = 300
): Promise<Buffer> {
  return sharp(inputBuffer)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toBuffer();
}

/**
 * Cloud Function triggered by Cloud Storage when a file is uploaded
 */
functions.cloudEvent(
  'processUploadedFile',
  async (cloudEvent: CloudEvent<StorageObjectData>) => {
    try {
      console.log('Thumbnail generator started');
      console.log('Event ID:', cloudEvent.id);
      console.log('Event Type:', cloudEvent.type);

      // Get file information from the event
      const file = cloudEvent.data;
      if (!file) {
        throw new Error('No file data in event');
      }

      console.log('Bucket:', file.bucket);
      console.log('File:', file.name);
      console.log('Content Type:', file.contentType);

      // Skip if this is already a thumbnail
      if (file.name?.includes('-thumbnail')) {
        console.log('This is already a thumbnail, skipping processing');
        return;
      }

      // Only process images
      if (!isImage(file.contentType)) {
        console.log(
          `File ${file.name} is not an image (${file.contentType}), skipping`
        );
        return;
      }

      // Extract user ID from file path
      const userId = extractUserIdFromPath(file.name);
      if (!userId) {
        console.log(`Could not extract user ID from path: ${file.name}`);
        return;
      }

      // Generate thumbnail name
      const fileName = path.basename(file.name);
      const thumbnailName = getThumbnailName(fileName);
      const thumbnailPath = file.name.replace(fileName, thumbnailName);

      console.log(
        `Processing ${file.name} to create thumbnail at ${thumbnailPath}`
      );

      // Download the file
      const bucket = storage.bucket(file.bucket);
      const [fileContent] = await bucket.file(file.name).download();

      // Generate thumbnail
      const thumbnailBuffer = await generateThumbnail(fileContent);

      // Upload the thumbnail
      await bucket.file(thumbnailPath).save(thumbnailBuffer, {
        metadata: {
          contentType: file.contentType,
          metadata: {
            source: 'thumbnail-generator',
            originalFile: file.name,
          },
        },
      });

      console.log(`Thumbnail created successfully at ${thumbnailPath}`);

      //await updateAssetWithThumbnail(fileName, thumbnailName, thumbnailPath);

      console.log('Processing completed successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error processing file:', error);
      return Promise.reject(error);
    }
  }
);
async function updateAssetWithThumbnail(
  fileName: string,
  thumbnailName: string,
  thumbnailPath: string
) {
  try {
    console.log(`Looking for assets referencing file: ${fileName}`);

    // Find asset document that references this file
    const assetsRef = firestore.collection('assets');
    const querySnapshot = await assetsRef
      .where('files', 'array-contains', {fileName: fileName})
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      console.log(`No asset document found referencing file: ${fileName}`);
    } else {
      const assetDoc = querySnapshot.docs[0];
      const assetData = assetDoc.data();
      console.log(`Found asset ${assetDoc.id} to update with thumbnail info`);

      // Update the file with thumbnail information
      const updatedFiles = assetData.files.map((file: any) => {
        if (file.fileName === fileName) {
          return {
            ...file,
            thumbnailName,
            thumbnailPath,
          };
        }
        return file;
      });

      // Update the document
      await assetDoc.ref.update({
        files: updatedFiles,
        updatedAt: new Date().toISOString(),
      });

      console.log(`Updated asset ${assetDoc.id} with thumbnail information`);
    }
  } catch (error) {
    // Don't fail the whole function if Firestore update fails
    console.error('Error updating Firestore:', error);
  }
}
