import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/auth/decorators/public.decorator';
import { FirestoreService } from 'src/shared/services/firestore.service';
import { StorageService } from 'src/shared/services/storage.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private firestoreService: FirestoreService,
    private storageService: StorageService,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  check() {
    return this.health.check([
      // Basic health indicators
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),

      // Firebase and Cloud Storage indicators
      async () => this.checkFirestore(),
      async () => this.checkStorage(),
    ]);
  }

  @Get('instance')
  @Public()
  getInstanceInfo() {
    return {
      instanceId: process.env.K_REVISION || 'unknown',
      region:
        process.env.FUNCTION_REGION ||
        process.env.CLOUD_RUN_REGION ||
        'unknown',
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  private async checkFirestore(): Promise<HealthIndicatorResult> {
    try {
      const firestore = this.firestoreService.getFirestore();
      await firestore.collection('health-check').limit(1).get();
      return { firestore: { status: 'up' } };
    } catch (error) {
      return { firestore: { status: 'down', message: error.message } };
    }
  }

  private async checkStorage(): Promise<HealthIndicatorResult> {
    try {
      const storage = this.storageService.getStorage();
      await storage.getBuckets({ maxResults: 1 });
      return { 'cloud-storage': { status: 'up' } };
    } catch (error) {
      return { 'cloud-storage': { status: 'down', message: error.message } };
    }
  }
}
