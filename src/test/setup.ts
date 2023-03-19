import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { testUser } from '../users/test/stubs/user.stub';
import { UsersService } from '../users/users.service';

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  // make sure that for every test we have a testing user
  const usersService = moduleRef.get<UsersService>(UsersService);
  await usersService.register(testUser);

  await app.close();
};
