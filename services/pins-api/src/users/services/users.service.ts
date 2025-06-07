import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { UserIdentifier } from 'firebase-admin/auth';

@Injectable()
export class UsersService {
  constructor(private readonly firebase: FirebaseService) {}

  async getUsersDataBatch(userIds: string[]) {
    const ids = userIds.map((id) => ({ uid: id }) as UserIdentifier);
    const users = await this.firebase.getApp().auth().getUsers(ids);
    return users;
  }
}
