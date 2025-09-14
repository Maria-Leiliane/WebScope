import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('SearchController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.searchResult.deleteMany({});
    await prisma.searchJob.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  it('should run the full CRUD lifecycle for a search job', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/search')
      .send({ keyword: 'e2e-test', url: 'https://nestjs.com' })
      .expect(201);

    const createdJob = createResponse.body;
    expect(createdJob).toHaveProperty('id');
    const jobId = createdJob.id;

    // 2. POLLING: await the job end
    let jobStatus = 'active';
    let attempts = 0;
    while (jobStatus !== 'done' && attempts < 20) { // Timeout de 10s
      await new Promise((resolve) => setTimeout(resolve, 500));
      const pollResponse = await request(app.getHttpServer()).get(`/search/${jobId}`);
      if (pollResponse.body.status) {
        jobStatus = pollResponse.body.status;
      }
      attempts++;
    }
    expect(jobStatus).toBe('done');

    const listResponse = await request(app.getHttpServer())
      .get('/search')
      .expect(200);

    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].id).toBe(jobId);

    await request(app.getHttpServer())
      .delete(`/search/${jobId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/search/${jobId}`)
      .expect(404);
  });

  it('should return a 400 Bad Request for invalid data', () => {
    return request(app.getHttpServer())
      .post('/search')
      .send({ keyword: 'no', url: 'not-a-url' })
      .expect(400);
  });
});