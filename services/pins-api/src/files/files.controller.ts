import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UploadUrlRequestDto } from 'src/files/services/signed-urls.dto';
import { SignedUrlsService } from 'src/files/services/signed-urls.service';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('files')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly signedUrlsService: SignedUrlsService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Generate a signed URL for file upload' })
  async getUploadUrl(
    @Body() generateUploadUrlDto: UploadUrlRequestDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.signedUrlsService.generateUserUploadUrl({
      ...generateUploadUrlDto,
      userId,
    });
  }
}
