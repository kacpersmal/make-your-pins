import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ConfigureSwagger from 'src/utils/swagger-config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from 'src/shared/filters/global-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  ConfigureSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
