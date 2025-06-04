import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './strategies/firebase-auth.strategy';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
    SharedModule,
  ],
  providers: [FirebaseAuthStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
