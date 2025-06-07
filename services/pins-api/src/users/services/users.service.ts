import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { UserIdentifier, UserRecord } from 'firebase-admin/auth';

@Injectable()
export class UsersService {
  constructor(private readonly firebase: FirebaseService) {}
  private readonly logger = new Logger(UsersService.name);

  async getUsersDataBatch(userIds: string[]) {
    const ids = userIds.map((id) => ({ uid: id }) as UserIdentifier);
    const users = await this.firebase.getApp().auth().getUsers(ids);
    return users;
  }

  async getUserData(userId: string) {
    const user = await this.firebase.getApp().auth().getUser(userId);
    return user;
  }

  async listUsers(maxResults: number = 1000): Promise<{ users: UserRecord[] }> {
    try {
      // Firebase Auth doesn't directly support pagination, so we need to handle it manually
      const listUsersResult = await this.firebase
        .getApp()
        .auth()
        .listUsers(maxResults);
      return { users: listUsersResult.users };
    } catch (error) {
      this.logger.error(`Error listing users: ${error.message}`);
      throw error;
    }
  }
}
