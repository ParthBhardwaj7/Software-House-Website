import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const corsOrigin = process.env.CORS_ORIGIN;
  if (process.env.NODE_ENV === 'production' && !corsOrigin) {
    console.warn(
      '[api] CORS_ORIGIN is not set — all origins are allowed. Set CORS_ORIGIN to your frontend URL (e.g. https://yourdomain.com) for production.',
    );
  }
  app.enableCors({
    origin: corsOrigin || true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}
bootstrap();
