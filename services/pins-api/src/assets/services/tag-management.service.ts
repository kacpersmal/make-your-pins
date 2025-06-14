import { Injectable, Logger } from '@nestjs/common';
import { FirestoreService } from 'src/shared/services/firestore.service';

export interface TagData {
  value: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class TagManagementService {
  private readonly logger = new Logger(TagManagementService.name);

  constructor(private readonly firestore: FirestoreService) {}

  /**
   * Get popular tags with pagination
   */
  async getPopularTags(
    limit: number = 20,
    offset: number = 0,
  ): Promise<TagData[]> {
    const plimit = parseInt(limit as any, 10);
    const poffset = parseInt(offset as any, 10);
    try {
      const snapshot = await this.firestore
        .getFirestore()
        .collection('tags')
        .orderBy('count', 'desc')
        .limit(plimit)
        .offset(poffset)
        .get();

      return snapshot.docs.map((doc) => doc.data() as TagData);
    } catch (error) {
      this.logger.error(`Error fetching popular tags: ${error.message}`);
      return [];
    }
  }

  /**
   * Search tags by prefix
   */
  async searchTagsByPrefix(
    prefix: string,
    limit: number = 10,
  ): Promise<TagData[]> {
    if (!prefix) return [];

    try {
      const prefixLower = prefix.toLowerCase();
      const endPrefix = prefixLower + '\uf8ff'; // High Unicode value to get all results with the prefix

      const snapshot = await this.firestore
        .getFirestore()
        .collection('tags')
        .orderBy('value')
        .startAt(prefixLower)
        .endAt(endPrefix)
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => doc.data() as TagData);
    } catch (error) {
      this.logger.error(`Error searching tags by prefix: ${error.message}`);
      return [];
    }
  }

  /**
   * Get tag suggestions based on existing tags
   */
  async getTagSuggestions(
    existingTags: string[],
    limit: number = 5,
  ): Promise<TagData[]> {
    if (!existingTags.length) {
      return this.getPopularTags(limit);
    }

    try {
      // For simplicity, just return popular tags that are not in the existing tags
      const popularTags = await this.getPopularTags(
        limit + existingTags.length,
      );
      const existingTagsSet = new Set(
        existingTags.map((tag) => tag.toLowerCase()),
      );

      return popularTags
        .filter((tag) => !existingTagsSet.has(tag.value))
        .slice(0, limit);
    } catch (error) {
      this.logger.error(`Error getting tag suggestions: ${error.message}`);
      return [];
    }
  }
}
