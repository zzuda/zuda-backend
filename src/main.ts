import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>('ConfigService');

  const corsHost = config.get<string>('CORS_HOST', 'http://localhost:3000');

  app.enableCors({
    origin: corsHost
  });

  await app.listen(8080);
}

bootstrap();
