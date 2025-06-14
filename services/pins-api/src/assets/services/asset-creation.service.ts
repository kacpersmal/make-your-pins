import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AssetFile,
  CreateAssetDto,
  CreateAssetWithOwner,
  AssetTag,
} from 'src/assets/services/asset-creation.dto';
import { UpdateAssetDto } from './asset-update.dto';
import { FirestoreService } from 'src/shared/services/firestore.service';
import { StorageService } from 'src/shared/services/storage.service';
import { SignedUrlsService } from 'src/files/services/signed-urls.service';
import { AssetCachingService } from './asset-caching.service';
import * as admin from 'firebase-admin';

@Injectable()
export class AssetCreationService {
  private readonly logger = new Logger(AssetCreationService.name);
  constructor(
    private readonly storageService: StorageService,
    private readonly firestore: FirestoreService,
    private readonly configService: ConfigService,
    private readonly signedUrlService: SignedUrlsService,
    private readonly cachingService: AssetCachingService,
  ) {}

  async createAsset({
    description,
    files,
    tags,
    ownerId,
    name,
  }: CreateAssetWithOwner): Promise<CreateAssetDto> {
    const timestamp = new Date().toISOString();
    await this.verifyAssetFiles(files, ownerId);
    const createdAsset = await this.firestore
      .getFirestore()
      .collection('assets')
      .add({
        name,
        description,
        files: files.map((file) => ({
          fileName: file.fileName,
          order: file.order || 0,
          type: file.type,
          thumbnailName: this.getThumbnailName(file.fileName),
        })),
        tags: tags?.map((tag) => ({ value: tag.value })) || [],
        ownerId,
        timestamp,
        upvotes: 0,
        downvotes: 0,
        views: 0,
      });

    if (tags && tags.length > 0) {
      await this.updateTagsCollection(tags);
    }

    // Invalidate search results cache since we've added a new asset
    try {
      await this.cachingService.invalidateSearchResults();
      this.logger.log(
        `Invalidated search cache after creating asset ${createdAsset.id}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to invalidate cache after asset creation: ${error.message}`,
      );
      // Continue execution even if cache invalidation fails
    }

    return {
      id: createdAsset.id,
      name,
      description,
      files,
      tags,
      ownerId,
    };
  }

  async updateAsset(
    assetId: string,
    updateData: UpdateAssetDto,
    userId: string,
  ): Promise<CreateAssetDto> {
    const assetRef = this.firestore
      .getFirestore()
      .collection('assets')
      .doc(assetId);
    const assetDoc = await assetRef.get();

    if (!assetDoc.exists) {
      this.logger.error(`Asset ${assetId} not found`);
      throw new NotFoundException(`Asset with ID ${assetId} not found`);
    }

    const assetData = assetDoc.data();
    if (!assetData) {
      this.logger.error(`Asset ${assetId} data is null or undefined`);
      throw new NotFoundException(`Asset with ID ${assetId} not found`);
    }

    if (assetData.ownerId !== userId) {
      this.logger.error(
        `User ${userId} does not have permission to update asset ${assetId}`,
      );
      throw new ForbiddenException(
        'You do not have permission to update this asset',
      );
    }

    const updateTimestamp = new Date().toISOString();
    const updatePayload: Record<string, any> = {
      updatedAt: updateTimestamp,
    };

    if (!updateData) {
      this.logger.error(`No update data provided for asset ${assetId}`);
      throw new BadRequestException(
        `No update data provided for asset ${assetId}`,
      );
    }

    if (updateData?.name) {
      updatePayload.name = updateData?.name;
    }

    if (updateData?.description) {
      updatePayload.description = updateData?.description;
    }

    if (updateData?.tags) {
      updatePayload.tags = updateData?.tags.map((tag) => ({
        value: tag.value,
      }));

      await this.updateTagsCollection(updateData.tags);
    }

    if (updateData?.files && updateData?.files.length > 0) {
      await this.verifyAssetFiles(updateData.files, userId);

      updatePayload.files = updateData.files.map((file) => ({
        fileName: file.fileName,
        order: file.order || 0,
        type: file.type,
        thumbnailName: this.getThumbnailName(file.fileName),
      }));
    }

    this.logger.log(
      `Updating asset ${assetId} with data: ${JSON.stringify(updatePayload)}`,
    );

    await assetRef.update(updatePayload);

    // Invalidate both the specific asset cache and search results cache
    try {
      await this.cachingService.invalidateAssetAndSearchResults(assetId);
      this.logger.log(`Invalidated cache for asset ${assetId} after update`);
    } catch (error) {
      this.logger.warn(
        `Failed to invalidate cache after asset update: ${error.message}`,
      );
      // Continue execution even if cache invalidation fails
    }

    const updatedDoc = await assetRef.get();
    const updatedData = updatedDoc.data();

    return {
      id: assetId,
      name: updatedData?.name,
      description: updatedData?.description,
      files: updatedData?.files,
      tags: updatedData?.tags,
      ownerId: updatedData?.ownerId,
    };
  }

  private async verifyAssetFiles(
    files: AssetFile[],
    ownerId: string,
  ): Promise<void> {
    const bucketName = this.configService.get<string>('ASSETS_BUCKET_NAME');
    if (!bucketName) {
      throw new Error('Google Cloud Storage bucket name is not configured');
    }

    const storage = this.storageService.getStorage();
    const bucket = storage.bucket(bucketName);
    for (const file of files) {
      if (!file.fileName) {
        throw new Error('File name is required');
      }
      const path = this.signedUrlService.generateFilePath(
        'users',
        ownerId,
        file.fileName,
      );

      this.logger.log(`Verifying file existence at path: ${path}`);
      const fileExists = await bucket.file(path).exists();
      if (!fileExists[0]) {
        throw new Error(`File ${file.fileName} does not exist in the bucket`);
      }
    }
  }

  private async updateTagsCollection(tags: AssetTag[]): Promise<void> {
    try {
      const firestore = this.firestore.getFirestore();
      const tagsCollection = firestore.collection('tags');

      for (const tag of tags) {
        if (!tag.value) continue;

        const tagValue = tag.value.toLowerCase().trim();
        const tagDocRef = tagsCollection.doc(tagValue);

        // Use a transaction to safely increment the count or add a new tag
        await firestore.runTransaction(async (transaction) => {
          const tagDoc = await transaction.get(tagDocRef);

          if (tagDoc.exists) {
            // Tag exists, increment count
            transaction.update(tagDocRef, {
              count: admin.firestore.FieldValue.increment(1),
              updatedAt: new Date().toISOString(),
            });
          } else {
            // New tag, create with count = 1
            transaction.set(tagDocRef, {
              value: tagValue,
              count: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        });
      }

      this.logger.log(`Updated tags collection with ${tags.length} tags`);
    } catch (error) {
      this.logger.error(`Error updating tags collection: ${error.message}`);
      // Don't throw the error to avoid disrupting the main asset creation flow
    }
  }

  private getThumbnailName(fileName: string): string {
    // More robust regex that handles various file extensions
    const withThumbnail = fileName.replace(/(\.[^.\\/]+)$/, '-thumbnail$1');

    // Fallback if regex didn't work (no extension or regex failed)
    if (withThumbnail === fileName) {
      return `${fileName}-thumbnail`;
    }

    return withThumbnail;
  }
}
