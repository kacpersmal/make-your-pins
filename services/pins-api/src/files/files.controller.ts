import { Body, Controller, Post } from '@nestjs/common';
import { GenerateUploadUrl } from 'src/files/services/signed-urls.dto';
import { SignedUrlsService } from 'src/files/services/signed-urls.service';

@Controller('files')
export class FilesController {
  constructor(private readonly signedUrlsService: SignedUrlsService) {}

  @Post('upload-url')
  async getUploadUrl(
    @Body()
    generateUploadUrlDto: Omit<GenerateUploadUrl, 'userId'> & {
      userId: string;
    },
  ) {
    return this.signedUrlsService.generateUserUploadUrl(generateUploadUrlDto);
  }
}
