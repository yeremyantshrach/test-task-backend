import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  INestApplication,
  NestInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@/settings/config';
import { GlobalExceptionFilter } from "@/common/filters";

async function configureSwagger(app: INestApplication) {
  const appVersion = process.env.npm_package_version ?? 'unknown';
  const swaggerConfig = new DocumentBuilder()
    .setTitle('riot games Service')
    .setDescription('Service responsible for getting data from riot games')
    .setVersion(appVersion)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const options: SwaggerCustomOptions = {
    customSiteTitle: 'riot games API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('swagger', app, document, options);
  app
    .getHttpAdapter()
    .get('/swagger/openapi.json', (req, res) => res.json(document));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<IAppConfig, true>>(ConfigService);
  const env = configService.get('env', { infer: true });
  const port = configService.get('port', { infer: true });
  const interceptors: NestInterceptor[] = [
    new ClassSerializerInterceptor(app.get(Reflector)),
  ];
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(...interceptors);

  const isSwaggerEnabled =
    env !== 'prod' ||
    configService.get('flags.prodSwaggerEnabled', { infer: true });
  if (isSwaggerEnabled) {
    await configureSwagger(app);
  }

  const httpAdapterHost = app.get<HttpAdapterHost>(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost, env));

  await app.listen(port, async () => {
    console.log(`Application is running on: ${await app.getUrl()}`);
    if (isSwaggerEnabled) {
      console.log(`Swagger is running on: ${await app.getUrl()}/swagger`);
    }
  });
}
bootstrap();
