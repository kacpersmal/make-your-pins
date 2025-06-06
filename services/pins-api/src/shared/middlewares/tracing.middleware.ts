import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MonitoringService } from '../services/monitoring.service';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TraceMiddleware.name);

  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = req.header('X-Cloud-Trace-Context') || `${uuidv4()}/0;o=1`;

    // Store trace in request for downstream use
    (req as any).traceId = traceId;

    // Set trace context in response header (helpful for debugging)
    res.setHeader('X-Cloud-Trace-Context', traceId);

    // Store the request start time for calculating duration
    const startTime = Date.now();

    // After the response is sent, record metrics
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const path = req.path;
      const method = req.method;
      const statusCode = res.statusCode;

      // Record API metrics
      this.monitoringService
        .recordApiCall(`${method} ${path}`, statusCode, duration)
        .catch((err) => {
          this.logger.error(`Failed to record metrics: ${err.message}`);
        });

      // Log request completion in structured format
      this.logger.log({
        message: `${method} ${path} ${statusCode} ${duration}ms`,
        method,
        path,
        statusCode,
        duration,
        traceId,
      });
    });

    next();
  }
}
