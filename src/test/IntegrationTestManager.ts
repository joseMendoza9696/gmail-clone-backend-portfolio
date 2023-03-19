import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '../app.module';
import { MongodbService } from '../mongodb/mongodb.service';
import { testUser } from '../users/test/stubs/user.stub';
import { AuthService } from '../utils/auth.service';
import { EmailService } from '../email/email.service';

export class IntegrationTestManager {
  public httpServer: any;

  private app: INestApplication;
  private accessToken: string;
  private connection: Connection;

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // nestjs application & initialization
    this.app = moduleRef.createNestApplication();
    await this.app.init();

    // configuration for http server
    this.httpServer = this.app.getHttpServer();
    const authService = this.app.get<AuthService>(AuthService);

    // mongodb connection
    this.connection = moduleRef
      .get<MongodbService>(MongodbService)
      .getDbHandle();

    // logs in a user in order to have an access token to use in our tests
    const userId = await this.connection
      .collection('users')
      .findOne({ email: testUser.email });
    this.accessToken = await authService.createUserToken(
      userId._id.toHexString(),
      testUser.email,
    );
  }

  async afterAll() {
    await this.app.close();
  }

  getCollection(collectionName: string) {
    return this.connection.collection(collectionName);
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getAuthServive() {
    return this.app.get<AuthService>(AuthService);
  }

  getEmailService() {
    return this.app.get<EmailService>(EmailService);
  }
}
