import { existsSync } from 'fs';
import { join } from 'path';
import { config as loadEnv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

/** Prisma reads DATABASE_URL from process.env; load apps/api/.env even when cwd is the monorepo root. */
function loadApiEnv(): void {
  const candidates = [
    join(__dirname, '..', '.env'),
    join(process.cwd(), '.env'),
    join(process.cwd(), 'apps', 'api', '.env'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      loadEnv({ path: p });
      return;
    }
  }
  loadEnv();
}

async function bootstrap() {
  loadApiEnv();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.enableShutdownHooks();
  if (process.env.TRUST_PROXY === '1') {
    app.set('trust proxy', 1);
  }
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
