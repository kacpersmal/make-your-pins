import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/auth/decorators/public.decorator';
import { FirestoreService } from './services/firestore.service';
import { StorageService } from './services/storage.service';
import { MonitoringService } from './services/monitoring.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private firestoreService: FirestoreService,
    private storageService: StorageService,
    private monitoringService: MonitoringService,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  async check() {
    // Record health check metric
    await this.monitoringService.recordMetric('api/health_check', 1);

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
  async getInstanceInfo() {
    const info = {
      instanceId: process.env.K_REVISION || 'unknown',
      region:
        process.env.FUNCTION_REGION ||
        process.env.CLOUD_RUN_REGION ||
        'unknown',
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    // Record instance info check metric
    await this.monitoringService.recordMetric('api/instance_info', 1);

    return info;
  }

  // Add a lightweight liveness check endpoint
  @Get('liveness')
  @Public()
  async liveness() {
    await this.monitoringService.recordMetric('api/liveness_check', 1);
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  private async checkFirestore(): Promise<HealthIndicatorResult> {
    try {
      const firestore = this.firestoreService.getFirestore();
      await firestore.collection('health-check').limit(1).get();
      return { firestore: { status: 'up' } };
    } catch (error) {
      // Record firestore error metric
      await this.monitoringService.recordMetric('api/firestore_errors', 1);
      return { firestore: { status: 'down', message: error.message } };
    }
  }

  private async checkStorage(): Promise<HealthIndicatorResult> {
    try {
      const storage = this.storageService.getStorage();
      await storage.getBuckets({ maxResults: 1 });
      return { 'cloud-storage': { status: 'up' } };
    } catch (error) {
      // Record storage error metric
      await this.monitoringService.recordMetric('api/storage_errors', 1);
      return { 'cloud-storage': { status: 'down', message: error.message } };
    }
  }
}
