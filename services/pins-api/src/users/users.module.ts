import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { SharedModule } from 'src/shared/shared.module';
import { UsersController } from './users.controller';
import { UserProfileService } from './services/user-profile.service';
import { FeedController } from './feed.controller';

@Module({
  imports: [SharedModule],
  providers: [UsersService, UserProfileService],
  exports: [UsersService],
  controllers: [UsersController, FeedController],
})
export class UsersModule {}
