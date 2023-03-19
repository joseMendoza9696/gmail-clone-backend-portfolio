import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { MongodbService } from '../mongodb/mongodb.service';

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  // make sure when we finish our tests we drop the database
  const mongodbService = moduleRef.get<MongodbService>(MongodbService);
  await mongodbService.getDbHandle().dropDatabase();

  await app.close();
};
