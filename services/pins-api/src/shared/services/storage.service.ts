import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private storage: Storage;
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeStorage();
  }

  private initializeStorage() {
    try {
      const isLocalDev =
        this.configService.get<string>('NODE_ENV') === 'development';

      if (isLocalDev) {
        this.logger.log('Initializing storage for local development...');
        const credentialsPath = this.configService.get<string>(
          'GOOGLE_APPLICATION_CREDENTIALS',
        );
        this.storage = new Storage({
          keyFilename: credentialsPath,
        });
      } else {
        this.logger.log('Initializing storage for production...');
        this.storage = new Storage();
      }
    } catch (error) {
      this.logger.error(
        'Failed to initialize Google Cloud Storage',
        error instanceof Error ? error.message : String(error),
      );
      throw new Error('Google Cloud Storage initialization failed');
    }
  }

  getStorage(): Storage {
    if (!this.storage) {
      this.logger.error('Google Cloud Storage is not initialized');
      throw new Error('Google Cloud Storage is not initialized');
    }
    return this.storage;
  }
}
