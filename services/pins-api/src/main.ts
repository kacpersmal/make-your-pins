import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ConfigureSwagger from 'src/utils/swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  ConfigureSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
