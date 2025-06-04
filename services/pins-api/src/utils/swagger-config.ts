import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

const ConfigureSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Pins API')
    .setDescription('API documentation for Pins application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const theme = new SwaggerTheme();

  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    swagggerOptions: {
      persistAuthorization: true,
    },
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, options);
};

export default ConfigureSwagger;
