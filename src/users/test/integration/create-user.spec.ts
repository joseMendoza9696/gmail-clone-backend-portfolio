import { IntegrationTestManager } from '../../../test/IntegrationTestManager';
import request from 'supertest-graphql';
import { gql } from 'graphql-tag';
import { getGqlErrorStatus } from '../../../test/gqlStatus';

describe('registerUser', () => {
  const integrationTestManager = new IntegrationTestManager();

  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });

  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe('given that the user does not already exist', () => {
    describe('when a register mutation is executed', () => {
      beforeAll(async () => {
        await request<{ createUser: { token: string } }>(
          integrationTestManager.httpServer,
        )
          .mutate(
            gql`
              mutation USER_register($register: AuthUser!) {
                USER_register(register: $register) {
                  token
                }
              }
            `,
          )
          .variables({
            register: {
              email: 'example@gmail.com',
              password: 'hellobaby',
            },
          })
          .expectNoErrors();
      });

      test('then the new user should be in the db', async () => {
        const user = await integrationTestManager
          .getCollection('users')
          .findOne({
            email: 'example@gmail.com',
          });
        expect(user).toBeDefined();
      });
    });
  });

  describe('given that the user does already exists', () => {
    describe('when a createUser mutation is executed', () => {
      let resStatus: number;
      beforeAll(async () => {
        const { response } = await request<{
          errorResponse: { errors: any[]; data: null };
        }>(integrationTestManager.httpServer)
          .mutate(
            gql`
              mutation USER_register($register: AuthUser!) {
                USER_register(register: $register) {
                  token
                }
              }
            `,
          )
          .variables({
            register: {
              email: 'test@gmail.com',
              password: 'hellobaby',
            },
          });
        resStatus = getGqlErrorStatus(response);
      });

      test('then the response should have errors', () => {
        expect(resStatus).toBe('422');
      });
    });
  });
});
