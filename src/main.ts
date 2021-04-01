import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>('ConfigService');

  const corsHost = config.get<string>('CORS_HOST', 'http://localhost:3000');

  app.enableCors({
    origin: corsHost
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8080);
}

bootstrap();
