import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  it('/blogs (GET)', () => {
    return request(app.getHttpServer()).get('/blogs').expect(200);
  });

  it('/projects (GET)', () => {
    return request(app.getHttpServer()).get('/projects').expect(200);
  });

  it('/testimonials (GET)', () => {
    return request(app.getHttpServer()).get('/testimonials').expect(200);
  });
});
