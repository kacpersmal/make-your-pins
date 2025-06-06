import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TracingService {
  private readonly logger = new Logger(TracingService.name);
  private readonly projectId: string;

  constructor(private readonly configService: ConfigService) {
    this.projectId =
      this.configService.get<string>('PROJECT_ID') ||
      process.env.GOOGLE_CLOUD_PROJECT ||
      '';
  }

  /**
   * Get trace ID from context
   */
  getTraceId(traceHeader?: string): string | undefined {
    const header =
      traceHeader ||
      process.env.CLOUD_TRACE_CONTEXT ||
      process.env._X_CLOUD_TRACE_CONTEXT;

    if (!header) return undefined;

    try {
      return header.split('/')[0];
    } catch (error) {
      this.logger.warn(`Invalid trace header: ${header}`);
      return undefined;
    }
  }

  /**
   * Format a trace ID for Cloud Logging
   */
  formatTraceForCloudLogging(traceId?: string): string | undefined {
    if (!traceId || !this.projectId) return undefined;

    return `projects/${this.projectId}/traces/${traceId}`;
  }
}
