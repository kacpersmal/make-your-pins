import { Module } from '@nestjs/common';
import { SignedUrlsService } from './services/signed-urls.service';
import { FilesController } from './files.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [SignedUrlsService],
  controllers: [FilesController],
  exports: [SignedUrlsService],
})
export class FilesModule {}
