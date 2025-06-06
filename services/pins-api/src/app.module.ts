import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from 'src/utils/validate-env';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { AssetsModule } from './assets/assets.module';
import { CacheModule } from '@nestjs/cache-manager';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 5 * 1000, // 5 minutes default TTL
      max: 100, // Maximum number of items in cache
    }),
    SharedModule,
    FilesModule,
    AuthModule,
    AssetsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
