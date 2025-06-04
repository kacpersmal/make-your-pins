import { Module } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { FirestoreService } from './services/firestore.service';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from 'src/shared/services/storage.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [FirebaseService, FirestoreService, StorageService],
  exports: [FirebaseService, FirestoreService, StorageService],
})
export class SharedModule {}
