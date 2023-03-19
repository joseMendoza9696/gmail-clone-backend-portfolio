import { IntegrationTestManager } from '../../../test/IntegrationTestManager';
import request from 'supertest-graphql';
import gql from 'graphql-tag';

describe('List inbox emails', () => {
  const exampleToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTc1NTgxYzNhOTg4N2E1MTk0ZDJkZSIsImVtYWlsIjoiZXhhbXBsZUBnbWFpbC5jb20iLCJpYXQiOjE2NzkyNTA4MTd9.G5KGfgJFw8PrNnSYs2hj7UgI4DIDJEeOcibWKCQmIHM`;
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe('given test@gmail.com and example@gmail.com users exist', () => {
    describe('when example@gmail.com sends 2 emails to test@gmail.com user', () => {
      beforeAll(async () => {
        await request<string>(integrationTestManager.httpServer)
          .set('Authorization', `Bearer ${exampleToken}`)
          .mutate(
            gql`
              mutation EMAIL_create($email: EmailCreate!) {
                EMAIL_create(email: $email)
              }
            `,
          )
          .variables({
            email: {
              to: 'test@gmail.com',
              body: 'testing 1 from example@gmail.com',
              subject: 'TEST1',
            },
          })
          .expectNoErrors();
        await request<string>(integrationTestManager.httpServer)
          .set('Authorization', `Bearer ${exampleToken}`)
          .mutate(
            gql`
              mutation EMAIL_create($email: EmailCreate!) {
                EMAIL_create(email: $email)
              }
            `,
          )
          .variables({
            email: {
              to: 'test@gmail.com',
              body: 'testing 2 from example@gmail.com',
              subject: 'TEST2',
            },
          })
          .expectNoErrors();
      });

      test('then the list of inbox emails should return the emails in the proper order', async () => {
        const emailService = integrationTestManager.getEmailService();
        const authService = integrationTestManager.getAuthServive();
        const testToken = integrationTestManager.getAccessToken();
        const decodedTestToken = authService.verifyToken(testToken);

        const emails = await emailService.emailsReceived(decodedTestToken);

        expect(emails[0].subject).toEqual('TEST2');
      });
    });
  });
});
