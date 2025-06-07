import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  AssetQueryDto,
  AssetResponseDto,
  PaginatedAssetsResponseDto,
} from './asset-fetching.dto';

@Injectable()
export class AssetCachingService {
  private readonly logger = new Logger(AssetCachingService.name);

  // Cache TTL constants (in milliseconds)
  private readonly SINGLE_ASSET_TTL = 10 * 60 * 1000; // 10 minutes
  private readonly SEARCH_RESULTS_TTL = 2 * 60 * 1000; // 2 minutes

  // Cache key prefixes for better organization
  private readonly ASSET_KEY_PREFIX = 'assets:id:';
  private readonly SEARCH_KEY_PREFIX = 'assets:search:';

  // Keep track of keys we've created for easy invalidation
  private readonly cachedSearchKeys: Set<string> = new Set();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAsset(
    assetId: string,
    fetchFn: () => Promise<AssetResponseDto>,
  ): Promise<AssetResponseDto> {
    const cacheKey = this.getAssetCacheKey(assetId);

    // Try to get from cache
    const cachedAsset = await this.cacheManager.get<AssetResponseDto>(cacheKey);

    if (cachedAsset) {
      this.logger.log(`Cache hit for asset ${assetId}`);
      return cachedAsset;
    }

    this.logger.log(`Cache miss for asset ${assetId}, fetching from database`);

    // Fetch asset using the provided function
    const asset = await fetchFn();

    // Store in cache
    await this.cacheManager.set(cacheKey, asset, this.SINGLE_ASSET_TTL);

    return asset;
  }

  async getSearchResults(
    queryParams: AssetQueryDto,
    fetchFn: () => Promise<PaginatedAssetsResponseDto>,
  ): Promise<PaginatedAssetsResponseDto> {
    const cacheKey = this.getSearchCacheKey(queryParams);

    // Try to get from cache
    const cachedResults =
      await this.cacheManager.get<PaginatedAssetsResponseDto>(cacheKey);

    if (cachedResults) {
      this.logger.log(`Cache hit for search query: ${cacheKey}`);
      return cachedResults;
    }

    this.logger.log(
      `Cache miss for search query: ${cacheKey}, fetching from database`,
    );

    // Fetch search results using the provided function
    const results = await fetchFn();

    // Store in cache
    await this.cacheManager.set(cacheKey, results, this.SEARCH_RESULTS_TTL);

    // Track this key for later invalidation
    this.cachedSearchKeys.add(cacheKey);

    return results;
  }

  async invalidateAsset(assetId: string): Promise<void> {
    this.logger.log(`Invalidating cache for asset ${assetId}`);
    const cacheKey = this.getAssetCacheKey(assetId);
    await this.cacheManager.del(cacheKey);
  }

  async invalidateSearchResults(): Promise<void> {
    this.logger.log('Invalidating all search results cache');

    try {
      // First, try using the keys we've tracked in memory
      if (this.cachedSearchKeys.size > 0) {
        const promises = Array.from(this.cachedSearchKeys).map((key) =>
          this.cacheManager.del(key),
        );

        await Promise.all(promises);
        this.logger.log(
          `Invalidated ${this.cachedSearchKeys.size} tracked search cache entries`,
        );
        this.cachedSearchKeys.clear();
        return;
      }

      // Fallback: try to get all cache keys from the cache provider
      const keys = await this.getCacheKeys();
      if (keys.length > 0) {
        const searchKeys = keys.filter((key) =>
          key.startsWith(this.SEARCH_KEY_PREFIX),
        );

        if (searchKeys.length > 0) {
          const promises = searchKeys.map((key) => this.cacheManager.del(key));
          await Promise.all(promises);
          this.logger.log(
            `Invalidated ${searchKeys.length} search cache entries`,
          );
        } else {
          this.logger.log('No search cache entries found to invalidate');
        }
      }
    } catch (error) {
      this.logger.warn(
        `Failed to invalidate search results cache: ${error.message}. Will try direct reset.`,
      );

      // Final fallback: try to reset the entire cache
      // Only do this if we can't specifically target search keys
      try {
        await this.resetEntireCache();
      } catch (resetError) {
        this.logger.error(`Failed to reset cache: ${resetError.message}`);
      }
    }
  }

  async invalidateAssetAndSearchResults(assetId: string): Promise<void> {
    this.logger.log(`Invalidating asset ${assetId} and all search results`);
    try {
      await Promise.all([
        this.invalidateAsset(assetId),
        this.invalidateSearchResults(),
      ]);
    } catch (error) {
      this.logger.error(`Error during cache invalidation: ${error.message}`);
    }
  }

  private getAssetCacheKey(assetId: string): string {
    return `${this.ASSET_KEY_PREFIX}${assetId}`;
  }

  private getSearchCacheKey(params: AssetQueryDto): string {
    const normalizedParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}:${value}`)
      .sort()
      .join(':');

    return `${this.SEARCH_KEY_PREFIX}${normalizedParams}`;
  }

  /**
   * Attempts to get all cache keys using different cache-manager versions' APIs
   */
  private async getCacheKeys(): Promise<string[]> {
    try {
      const cacheManagerAny = this.cacheManager as any;

      // Try cache-manager v5+ API
      if (
        cacheManagerAny.store &&
        typeof cacheManagerAny.store.keys === 'function'
      ) {
        return await cacheManagerAny.store.keys();
      }

      // Try cache-manager v4 API
      if (
        cacheManagerAny.stores &&
        Array.isArray(cacheManagerAny.stores) &&
        cacheManagerAny.stores.length > 0
      ) {
        const store = cacheManagerAny.stores[0];
        if (store && typeof store.keys === 'function') {
          return await store.keys();
        }
      }

      // Try direct access if available
      if (typeof cacheManagerAny.keys === 'function') {
        return await cacheManagerAny.keys();
      }

      this.logger.warn(
        'Unable to get cache keys - cache implementation does not support key listing',
      );
      return [];
    } catch (error) {
      this.logger.error(`Error getting cache keys: ${error.message}`);
      return [];
    }
  }

  /**
   * Last resort method to reset the entire cache
   * This is only used when targeted invalidation fails
   */
  private async resetEntireCache(): Promise<void> {
    try {
      const cacheManagerAny = this.cacheManager as any;

      // Try different reset methods based on cache-manager version
      if (typeof cacheManagerAny.reset === 'function') {
        await cacheManagerAny.reset();
        this.logger.log('Successfully reset entire cache');
        return;
      }

      if (
        cacheManagerAny.store &&
        typeof cacheManagerAny.store.reset === 'function'
      ) {
        await cacheManagerAny.store.reset();
        this.logger.log('Successfully reset entire cache store');
        return;
      }

      if (
        cacheManagerAny.stores &&
        Array.isArray(cacheManagerAny.stores) &&
        cacheManagerAny.stores.length > 0
      ) {
        const store = cacheManagerAny.stores[0];
        if (store && typeof store.reset === 'function') {
          await store.reset();
          this.logger.log('Successfully reset cache store');
          return;
        }
      }

      this.logger.warn('Unable to reset cache - no reset method available');
    } catch (error) {
      this.logger.error(`Failed to reset cache: ${error.message}`);
    }
  }
}
