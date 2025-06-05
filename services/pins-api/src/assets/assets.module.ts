import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetCreationService } from './services/asset-creation.service';
import { SharedModule } from 'src/shared/shared.module';
import { FilesModule } from 'src/files/files.module';
import { AssetFetchingService } from './services/asset-fetching.service';
import { AssetCachingService } from './services/asset-caching.service';
@Module({
  imports: [SharedModule, FilesModule],
  controllers: [AssetsController],
  providers: [AssetCreationService, AssetFetchingService, AssetCachingService],
})
export class AssetsModule {}
