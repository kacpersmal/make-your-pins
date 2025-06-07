import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { FirestoreService } from 'src/shared/services/firestore.service';
import { UsersService } from './users.service';
import {
  UserProfileResponseDto,
  UserProfileQueryDto,
  PaginatedUserProfilesResponseDto,
  FollowUserResponseDto,
} from './user-profile.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);
  private readonly userProfilesCollection = 'userProfiles';
  private readonly followersCollection = 'followers';
  private readonly assetsCollection = 'assets';

  constructor(
    private readonly firestore: FirestoreService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Get a user's complete profile
   * @param userId User ID to fetch
   * @param currentUserId Optional ID of the current user to check if following
   * @returns User profile with all counts
   */
  async getUserProfile(
    userId: string,
    currentUserId?: string,
  ): Promise<UserProfileResponseDto> {
    try {
      // Fetch Firebase user data
      const userData = await this.usersService.getUserData(userId);

      // Get user profile document (or create a default one)
      const profileDoc = await this.firestore
        .getFirestore()
        .collection(this.userProfilesCollection)
        .doc(userId)
        .get();

      const profileData = profileDoc.exists ? profileDoc.data() : { bio: '' };

      // Get followers count
      const followersCount = await this.getFollowersCount(userId);

      // Get following count
      const followingCount = await this.getFollowingCount(userId);

      // Get assets count
      const assetsCount = await this.getUserAssetsCount(userId);

      // Check if current user is following this profile
      let isFollowing = false;
      if (currentUserId && currentUserId !== userId) {
        isFollowing = await this.isFollowing(currentUserId, userId);
      }

      // Build and return the profile
      return {
        id: userId,
        displayName: userData.displayName || 'Anonymous User',
        email: userData.email,
        photoURL: userData.photoURL,
        followersCount,
        followingCount,
        assetsCount,
        bio: profileData?.bio || '',
        isFollowing,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching user profile for ${userId}: ${error.message}`,
      );

      if (error.code === 'auth/user-not-found') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      throw error;
    }
  }

  /**
   * List user profiles with pagination and filtering
   */
  async listUserProfiles(
    queryParams: UserProfileQueryDto,
    currentUserId?: string,
  ): Promise<PaginatedUserProfilesResponseDto> {
    const { name, limit, page } = queryParams;

    try {
      // First get all users from Firebase Auth
      const { users } = await this.usersService.listUsers(1000);

      // Filter by name if provided
      let filteredUsers = users;
      if (name) {
        const lowerName = name.toLowerCase();
        filteredUsers = users.filter((user) =>
          (user.displayName?.toLowerCase() || '').includes(lowerName),
        );
      }

      // Get total count
      const total = filteredUsers.length;

      // Calculate pagination
      const offset = page * limit;
      const paginatedUsers = filteredUsers.slice(offset, offset + limit);
      const pages = Math.ceil(total / limit);

      // Process each user to get full profile data
      const profilePromises = paginatedUsers.map(async (user) => {
        try {
          return await this.getUserProfile(user.uid, currentUserId);
        } catch (error) {
          this.logger.error(
            `Error processing user ${user.uid}: ${error.message}`,
          );
          // Return a minimal profile in case of error
          return {
            id: user.uid,
            displayName: user.displayName || 'Anonymous User',
            email: user.email,
            photoURL: user.photoURL,
            followersCount: 0,
            followingCount: 0,
            assetsCount: 0,
          };
        }
      });

      const items = await Promise.all(profilePromises);

      return {
        items,
        total,
        page,
        limit,
        pages,
      };
    } catch (error) {
      this.logger.error(`Error listing user profiles: ${error.message}`);
      throw error;
    }
  }

  /**
   * Follow a user
   */
  async followUser(
    followerId: string,
    targetUserId: string,
  ): Promise<FollowUserResponseDto> {
    // Validate users exist
    await this.usersService.getUserData(followerId);
    await this.usersService.getUserData(targetUserId);

    // Can't follow yourself
    if (followerId === targetUserId) {
      throw new ConflictException('You cannot follow yourself');
    }

    // Check if already following
    const isAlreadyFollowing = await this.isFollowing(followerId, targetUserId);
    if (isAlreadyFollowing) {
      throw new ConflictException('Already following this user');
    }

    const timestamp = new Date().toISOString();

    // Create follow relationship
    const followId = `${followerId}_${targetUserId}`;
    await this.firestore
      .getFirestore()
      .collection(this.followersCollection)
      .doc(followId)
      .set({
        followerId,
        targetUserId,
        timestamp,
      });

    return {
      success: true,
      followerId,
      targetUserId,
      timestamp,
    };
  }

  /**
   * Unfollow a user
   */
  async unfollowUser(
    followerId: string,
    targetUserId: string,
  ): Promise<FollowUserResponseDto> {
    // Validate users exist
    await this.usersService.getUserData(followerId);
    await this.usersService.getUserData(targetUserId);

    // Can't unfollow yourself
    if (followerId === targetUserId) {
      throw new ConflictException('You cannot unfollow yourself');
    }

    // Check if actually following
    const isFollowing = await this.isFollowing(followerId, targetUserId);
    if (!isFollowing) {
      throw new ConflictException('Not following this user');
    }

    const timestamp = new Date().toISOString();

    // Remove follow relationship
    const followId = `${followerId}_${targetUserId}`;
    await this.firestore
      .getFirestore()
      .collection(this.followersCollection)
      .doc(followId)
      .delete();

    return {
      success: true,
      followerId,
      targetUserId,
      timestamp,
    };
  }

  /**
   * Get a user's feed (assets from followed users)
   */
  async getUserFeed(userId: string, limit: number, page: number): Promise<any> {
    // Get list of users that this user follows
    const followedUsers = await this.getFollowedUsers(userId);

    if (followedUsers.length === 0) {
      return {
        items: [],
        total: 0,
        page,
        limit,
        pages: 0,
      };
    }

    // Query assets from followed users, order by timestamp
    const assetsQuery = this.firestore
      .getFirestore()
      .collection(this.assetsCollection)
      .where('ownerId', 'in', followedUsers)
      .orderBy('timestamp', 'desc');

    const snapshot = await assetsQuery.get();

    // Get total count
    const total = snapshot.docs.length;

    // Calculate pagination
    const offset = page * limit;
    const paginatedDocs = snapshot.docs.slice(offset, offset + limit);
    const pages = Math.ceil(total / limit);

    // Map to asset data
    const items = paginatedDocs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      items,
      total,
      page,
      limit,
      pages,
    };
  }

  /**
   * Get count of user's followers
   */
  private async getFollowersCount(userId: string): Promise<number> {
    const snapshot = await this.firestore
      .getFirestore()
      .collection(this.followersCollection)
      .where('targetUserId', '==', userId)
      .count()
      .get();

    return snapshot.data().count;
  }

  /**
   * Get count of users a user is following
   */
  private async getFollowingCount(userId: string): Promise<number> {
    const snapshot = await this.firestore
      .getFirestore()
      .collection(this.followersCollection)
      .where('followerId', '==', userId)
      .count()
      .get();

    return snapshot.data().count;
  }

  /**
   * Get count of assets created by a user
   */
  private async getUserAssetsCount(userId: string): Promise<number> {
    const snapshot = await this.firestore
      .getFirestore()
      .collection(this.assetsCollection)
      .where('ownerId', '==', userId)
      .count()
      .get();

    return snapshot.data().count;
  }

  /**
   * Check if a user is following another user
   */
  private async isFollowing(
    followerId: string,
    targetUserId: string,
  ): Promise<boolean> {
    const followId = `${followerId}_${targetUserId}`;
    const doc = await this.firestore
      .getFirestore()
      .collection(this.followersCollection)
      .doc(followId)
      .get();

    return doc.exists;
  }

  /**
   * Get list of users that a user is following
   */
  private async getFollowedUsers(userId: string): Promise<string[]> {
    const snapshot = await this.firestore
      .getFirestore()
      .collection(this.followersCollection)
      .where('followerId', '==', userId)
      .get();

    return snapshot.docs.map((doc) => doc.data().targetUserId);
  }
}
