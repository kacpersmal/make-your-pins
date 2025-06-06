import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { FirestoreService } from './services/firestore.service';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from 'src/shared/services/storage.service';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { CloudLoggerService } from './services/cloud-logger.service';
import { MonitoringService } from './services/monitoring.service';
import { TracingService } from './services/tracing.service';
import { TraceMiddleware } from './middlewares/tracing.middleware';

@Module({
  imports: [ConfigModule.forRoot(), TerminusModule],
  providers: [
    FirebaseService,
    FirestoreService,
    StorageService,
    CloudLoggerService,
    MonitoringService,
    TracingService,
  ],
  exports: [
    FirebaseService,
    FirestoreService,
    StorageService,
    CloudLoggerService,
    MonitoringService,
    TracingService,
  ],
  controllers: [HealthController],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
