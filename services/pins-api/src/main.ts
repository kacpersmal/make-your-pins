import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ConfigureSwagger from 'src/utils/swagger-config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from 'src/shared/filters/global-exception.filter';
import { CloudLoggerService } from './shared/services/cloud-logger.service';
import { ConfigService } from '@nestjs/config';
import { MonitoringService } from './shared/services/monitoring.service';
async function bootstrap() {
  // Create app first without custom logger
  const app = await NestFactory.create(AppModule);

  // Get ConfigService from app
  const configService = app.get(ConfigService);

  // Create and set custom logger
  app.useLogger(
    new CloudLoggerService(configService).setContext('Application'),
  );

  // Get MonitoringService for exception filter
  const monitoringService = app.get(MonitoringService);

  // Use both services in the exception filter
  app.useGlobalFilters(
    new GlobalExceptionFilter(monitoringService, configService),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  ConfigureSwagger(app);

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
void bootstrap();
