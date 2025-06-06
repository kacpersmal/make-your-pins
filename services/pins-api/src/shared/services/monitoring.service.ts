import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import monitoring from '@google-cloud/monitoring';

@Injectable()
export class MonitoringService implements OnModuleInit {
  private readonly logger = new Logger(MonitoringService.name);
  // Update the client initialization
  private readonly client = new monitoring.MetricServiceClient();
  private readonly projectId: string;
  private readonly instance: string;
  private readonly location: string;

  constructor(private readonly configService: ConfigService) {
    this.projectId =
      this.configService.get<string>('PROJECT_ID') ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      '';
    this.instance = process.env.K_REVISION || 'local-dev';
    this.location =
      process.env.CLOUD_RUN_REGION ||
      process.env.FUNCTION_REGION ||
      'unknown-region';
  }

  onModuleInit() {
    if (process.env.NODE_ENV === 'production' && !this.projectId) {
      this.logger.warn('PROJECT_ID not set, Cloud Monitoring will not work');
    }
  }

  /**
   * Record a custom metric
   */
  async recordMetric(
    metricType: string,
    value: number,
    additionalLabels: Record<string, string> = {},
  ): Promise<void> {
    if (!this.projectId || process.env.NODE_ENV !== 'production') {
      this.logger.debug(`Would record metric ${metricType}=${value}`);
      return;
    }

    try {
      const projectPath = this.client.projectPath(this.projectId);

      const timeSeriesData = {
        metric: {
          type: `custom.googleapis.com/${metricType}`,
          labels: {
            instance_id: this.instance,
            region: this.location,
            ...additionalLabels,
          },
        },
        resource: {
          type: 'generic_task',
          labels: {
            project_id: this.projectId,
            location: this.location,
            namespace: 'pins-api',
            job: 'api-server',
            task_id: this.instance,
          },
        },
        points: [
          {
            interval: {
              endTime: {
                seconds: Math.floor(Date.now() / 1000),
                nanos: (Date.now() % 1000) * 1e6,
              },
            },
            value: {
              doubleValue: value,
            },
          },
        ],
      };

      const request = {
        name: projectPath,
        timeSeries: [timeSeriesData],
      };

      await this.client.createTimeSeries(request);
      this.logger.debug(`Recorded metric ${metricType}=${value}`);
    } catch (error) {
      this.logger.error(
        `Failed to record metric ${metricType}: ${error.message}`,
      );
    }
  }

  // Utility methods for common metrics
  async recordApiCall(
    endpoint: string,
    statusCode: number,
    duration: number,
  ): Promise<void> {
    await this.recordMetric('api/requests', 1, {
      endpoint,
      status_code: statusCode.toString(),
    });
    await this.recordMetric('api/latency', duration, {
      endpoint,
    });
  }

  async recordAssetCreation(): Promise<void> {
    await this.recordMetric('assets/created', 1);
  }

  async recordAssetRetrieval(): Promise<void> {
    await this.recordMetric('assets/retrieved', 1);
  }
}
