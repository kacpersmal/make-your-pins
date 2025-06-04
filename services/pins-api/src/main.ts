import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ConfigureSwagger from 'src/utils/swagger-config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  ConfigureSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
