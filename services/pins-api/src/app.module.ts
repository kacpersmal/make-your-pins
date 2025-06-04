import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from 'src/utils/validate-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
