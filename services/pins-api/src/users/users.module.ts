import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
