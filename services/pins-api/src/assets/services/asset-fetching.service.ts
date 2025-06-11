import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FirestoreService } from 'src/shared/services/firestore.service';
import {
  AssetQueryDto,
  AssetResponseDto,
  PaginatedAssetsResponseDto,
} from './asset-fetching.dto';
import * as admin from 'firebase-admin';
import { SignedUrlsService } from 'src/files/services/signed-urls.service';
import { AssetFile } from './asset-creation.dto';
import { AssetCachingService } from './asset-caching.service';
import { UsersService } from 'src/users/services/users.service';

// Define an interface for the asset data structure
interface AssetData {
  id: string;
  name: string;
  description: string;
  files: AssetFile[];
  tags?: { value: string }[];
  ownerId: string;
  timestamp: string;
  updatedAt?: string;
  upvotes?: number;
  downvotes?: number;
  views?: number;
  [key: string]: any; // Allow other properties
}

@Injectable()
export class AssetFetchingService {
  private readonly logger = new Logger(AssetFetchingService.name);
  private readonly collectionName = 'assets';

  constructor(
    private readonly firestore: FirestoreService,
    private readonly signedUrlsService: SignedUrlsService,
    private readonly cachingService: AssetCachingService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Get a single asset by ID, with caching
   * @param assetId Asset ID to fetch
   * @returns Asset data
   * @throws NotFoundException if asset not found
   */
  async getAssetById(assetId: string): Promise<AssetResponseDto> {
    // Use the caching service with a factory function
    return this.cachingService.getAsset(assetId, async () => {
      this.logger.log(`Fetching asset with ID: ${assetId} from database`);

      const assetRef = this.firestore
        .getFirestore()
        .collection(this.collectionName)
        .doc(assetId);

      const assetDoc = await assetRef.get();

      if (!assetDoc.exists) {
        this.logger.error(`Asset ${assetId} not found`);
        throw new NotFoundException(`Asset with ID ${assetId} not found`);
      }

      const assetData = assetDoc.data();

      // Increment view count
      await assetRef.update({
        views: admin.firestore.FieldValue.increment(1),
      });

      // Map asset data
      const mappedAsset = this.mapAssetDocToResponseDto(assetId, assetData);

      // Enhance with owner data and return the first item
      const enhancedAssets = await this.enhanceAssetsWithOwnerData([
        mappedAsset,
      ]);
      return enhancedAssets[0];
    });
  }

  /**
   * Search assets with filtering and pagination, with caching
   * @param queryParams Search parameters
   * @returns Paginated list of assets
   */
  async searchAssets(
    queryParams: AssetQueryDto,
  ): Promise<PaginatedAssetsResponseDto> {
    // Use the caching service with a factory function
    return this.cachingService.getSearchResults(queryParams, async () => {
      this.logger.log(
        `Searching assets with params: ${JSON.stringify(queryParams)} from database`,
      );

      const { name, tag, ownerId } = queryParams;
      const limit = parseInt(queryParams.limit as unknown as string, 10) || 10;
      const page = parseInt(queryParams.page as unknown as string, 10) || 0;

      // Start building the query
      let query: admin.firestore.Query<admin.firestore.DocumentData> =
        this.firestore.getFirestore().collection(this.collectionName);

      // Apply filter by owner ID if provided
      if (ownerId) {
        query = query.where('ownerId', '==', ownerId);
      }

      // Apply tag filter if provided
      // Note: This requires a compound index if combined with other filters
      if (tag) {
        // This assumes tags are stored in a format that allows array-contains queries
        query = query.where('tags', 'array-contains', { value: tag });
      }

      // Order by timestamp (most recent first)
      // If you want to sort by updatedAt, you'll need to ensure it exists on all docs
      query = query.orderBy('timestamp', 'desc');

      try {
        // First get total count using count() query
        const countSnapshot = await query.count().get();
        const total = countSnapshot.data().count;

        // Apply pagination
        const pageSize = limit;
        const pageIndex = page;

        // Apply limit and offset
        if (pageIndex > 0) {
          // Get the last document from the previous page
          const lastDocSnapshot = await query
            .limit(pageIndex * pageSize)
            .get()
            .then((snapshot) => snapshot.docs[snapshot.docs.length - 1]);

          // Start after the last document
          if (lastDocSnapshot) {
            query = query.startAfter(lastDocSnapshot);
          }
        }

        // Apply limit for this page
        query = query.limit(pageSize);

        // Execute the query
        const snapshot = await query.get();

        // Calculate total pages
        const pages = Math.ceil(total / pageSize);

        // Map results
        let results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AssetData[];

        // For name filtering (which Firestore doesn't handle natively)
        // we still need some in-memory filtering
        if (name) {
          const lowerName = name.toLowerCase();
          results = results.filter((asset) =>
            asset.name.toLowerCase().includes(lowerName),
          );

          // Note: this affects the accuracy of our pagination
          // A more complete solution would use Algolia or Firebase Extensions for search
        }

        // Map results to response DTOs
        const mappedItems = await Promise.all(
          results.map((item) => this.mapAssetDocToResponseDto(item.id, item)),
        );

        // Enhance with owner data
        const items = await this.enhanceAssetsWithOwnerData(mappedItems);

        // Return paginated response
        return {
          items,
          total,
          page: pageIndex,
          limit: pageSize,
          pages,
        };
      } catch (error) {
        this.logger.error(`Error searching assets: ${error.message}`);
        throw new Error(`Failed to search assets: ${error.message}`);
      }
    });
  }

  /**
   * Map Firestore document data to AssetResponseDto
   * @param id Asset ID
   * @param data Asset data from Firestore
   * @returns Mapped AssetResponseDto with file paths
   */
  private mapAssetDocToResponseDto(id: string, data: any): AssetResponseDto {
    // Add paths to files
    const files =
      data.files?.map((file: AssetFile) => {
        const enhancedFile = { ...file };

        if (file.fileName && data.ownerId) {
          enhancedFile.path = this.signedUrlsService.generateFilePath(
            'users',
            data.ownerId,
            file.fileName,
          );
        }

        if (file.thumbnailName && data.ownerId) {
          enhancedFile.thumbnailPath = this.signedUrlsService.generateFilePath(
            'users',
            data.ownerId,
            file.thumbnailName,
          );
        }

        return enhancedFile;
      }) || [];

    return {
      id,
      name: data.name,
      description: data.description,
      files,
      tags: data.tags,
      ownerId: data.ownerId,
      owner: {
        id: data.ownerId,
        displayName: '',
      },
      timestamp: data.timestamp,
      updatedAt: data.updatedAt,
      upvotes: data.upvotes || 0,
      downvotes: data.downvotes || 0,
      views: data.views || 0,
    };
  }

  /**
   * Enhance assets with owner information
   * @param assets Assets to enhance with owner data
   * @returns Assets with owner information
   */
  private async enhanceAssetsWithOwnerData(
    assets: AssetResponseDto[],
  ): Promise<AssetResponseDto[]> {
    if (!assets.length) return assets;

    try {
      // Extract unique owner IDs
      const ownerIds = [...new Set(assets.map((asset) => asset.ownerId))];

      // Fetch user data in a single batch
      const usersResult = await this.userService.getUsersDataBatch(ownerIds);

      // Create a map of user data for quick lookup
      const userMap = new Map();
      usersResult.users.forEach((user) => {
        userMap.set(user.uid, {
          id: user.uid,
          displayName: user.displayName || 'Unknown User',
          email: user.email,
          photoURL: user.photoURL,
        });
      });

      // Enhance each asset with owner data
      return assets.map((asset) => {
        const userData = userMap.get(asset.ownerId);
        if (userData) {
          return {
            ...asset,
            owner: userData,
          };
        }
        return asset;
      });
    } catch (error) {
      this.logger.error(`Error fetching user data: ${error.message}`);
      // Return assets without owner enhancement if there's an error
      return assets;
    }
  }
}
