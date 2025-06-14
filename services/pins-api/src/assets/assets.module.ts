import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetCreationService } from './services/asset-creation.service';
import { SharedModule } from 'src/shared/shared.module';
import { FilesModule } from 'src/files/files.module';
import { AssetFetchingService } from './services/asset-fetching.service';
import { AssetCachingService } from './services/asset-caching.service';
import { UsersModule } from 'src/users/users.module';
import { TagManagementService } from './services/tag-management.service';
import { TagsController } from './tags.controller';
@Module({
  imports: [SharedModule, FilesModule, UsersModule],
  controllers: [AssetsController, TagsController],
  providers: [
    AssetCreationService,
    AssetFetchingService,
    AssetCachingService,
    TagManagementService,
  ],
})
export class AssetsModule {}
