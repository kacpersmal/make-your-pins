import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../services/monitoring.service';

@Injectable()
export class RequestMetricsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestMetricsMiddleware.name);

  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Start timing
    const start = process.hrtime();

    // Get path and HTTP method
    const path = req.path;
    const method = req.method;

    // Track response metrics
    res.on('finish', () => {
      // Calculate duration
      const [seconds, nanoseconds] = process.hrtime(start);
      const duration = seconds * 1000 + nanoseconds / 1000000; // in milliseconds

      // Get status code
      const statusCode = res.statusCode;

      // Record metrics
      this.monitoringService
        .recordApiCall(`${method} ${path}`, statusCode, duration)
        .catch((err) => {
          this.logger.error(`Failed to record metrics: ${err.message}`);
        });

      // Specific asset metrics
      if (path.includes('/assets')) {
        if (method === 'GET') {
          this.monitoringService.recordAssetRetrieval().catch((err) => {
            this.logger.error(
              `Failed to record asset retrieval: ${err.message}`,
            );
          });
        } else if (method === 'POST') {
          this.monitoringService.recordAssetCreation().catch((err) => {
            this.logger.error(
              `Failed to record asset creation: ${err.message}`,
            );
          });
        }
      }
    });

    next();
  }
}
