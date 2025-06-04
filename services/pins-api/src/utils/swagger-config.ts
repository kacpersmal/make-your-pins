import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const ConfigureSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Pins API')
    .setDescription('API documentation for Pins application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
};

export default ConfigureSwagger;
