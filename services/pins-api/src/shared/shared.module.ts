import { Module } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { FirestoreService } from './services/firestore.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [FirebaseService, FirestoreService],
  exports: [FirebaseService, FirestoreService],
})
export class SharedModule {}
