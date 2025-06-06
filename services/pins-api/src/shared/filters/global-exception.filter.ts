import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CloudLoggerService } from '../services/cloud-logger.service';
import { MonitoringService } from '../services/monitoring.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: CloudLoggerService;

  constructor(
    private readonly monitoringService: MonitoringService,
    configService: ConfigService,
  ) {
    this.logger = new CloudLoggerService(configService).setContext(
      'ExceptionFilter',
    );
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Extract path and method for monitoring
    const path = request.path;
    const method = request.method;

    // Record error metric
    await this.monitoringService
      .recordMetric('api/errors', 1, {
        endpoint: `${method} ${path}`,
        status_code: status.toString(),
      })
      .catch(() => {
        // Silently fail if monitoring fails
      });

    // Log the error
    this.logger.error(
      `${method} ${path} - ${status}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'object' ? message : { error: message },
    });
  }
}
