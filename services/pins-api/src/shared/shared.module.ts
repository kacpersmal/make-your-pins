import { Module } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { FirestoreService } from './services/firestore.service';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from 'src/shared/services/storage.service';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [ConfigModule.forRoot(), TerminusModule],
  providers: [FirebaseService, FirestoreService, StorageService],
  exports: [FirebaseService, FirestoreService, StorageService],
  controllers: [HealthController],
})
export class SharedModule {}
