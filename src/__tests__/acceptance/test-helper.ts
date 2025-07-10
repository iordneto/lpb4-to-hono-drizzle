import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {TestDbDataSource} from '../../datasources/test-db.datasource';
import {TestApplication} from './test-application';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new TestApplication({
    rest: restConfig,
  });

  // Override the datasource with in-memory database for testing
  app.bind('datasources.db').toClass(TestDbDataSource);

  await app.boot();

  // Create database schema - always drop and recreate for clean tests
  await app.migrateSchema({existingSchema: 'drop'});

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

// Function to clean data between tests
export async function cleanupDatabase(app: TestApplication) {
  await app.migrateSchema({existingSchema: 'drop'});
}

export interface AppWithClient {
  app: TestApplication;
  client: Client;
}

interface UserTestData {
  name?: string;
  email?: string;
  password?: string;
}

interface TaskTestData {
  title?: string;
  description?: string;
  completed?: boolean;
}

// Test data generators
export function givenUserData(data?: Partial<UserTestData>) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);

  return Object.assign(
    {
      name: 'Test User',
      email: `test-${timestamp}-${random}@example.com`, // Unique email for each test
      password: 'test123',
    },
    data,
  );
}

export function givenTaskData(data?: Partial<TaskTestData>) {
  return Object.assign(
    {
      title: 'Test Task',
      description: 'This is a test task',
      completed: false,
    },
    data,
  );
}

// Helper functions for authentication
export async function givenLoggedInUser(
  client: Client,
  userData?: Partial<UserTestData>,
) {
  const user = givenUserData(userData);

  // Register user
  await client.post('/auth/register').send(user);

  // Login to get token
  const loginRes = await client
    .post('/auth/login')
    .send({email: user.email, password: user.password})
    .expect(200);

  return {
    user: loginRes.body.user,
    token: loginRes.body.token,
  };
}

export function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}
