import {Client, expect} from '@loopback/testlab';
import {TestApplication} from './test-application';
import {
  cleanupDatabase,
  getAuthHeaders,
  givenLoggedInUser,
  givenTaskData,
  setupApplication,
} from './test-helper';

describe('TaskController (Simple Integration)', () => {
  let app: TestApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  // Clean data between each test to avoid interference
  beforeEach(async () => {
    await cleanupDatabase(app);
  });

  describe('POST /tasks', () => {
    it('successfully creates a task with authentication', async () => {
      const {token} = await givenLoggedInUser(client);
      const taskData = givenTaskData();

      const res = await client
        .post('/tasks')
        .set(getAuthHeaders(token))
        .send(taskData)
        .expect(200);

      expect(res.body).to.have.properties([
        'id',
        'title',
        'description',
        'completed',
        'userId',
        'createdAt',
        'updatedAt',
      ]);
      expect(res.body.title).to.equal(taskData.title);
      expect(res.body.description).to.equal(taskData.description);
      expect(res.body.completed).to.equal(false);
      expect(typeof res.body.userId).to.equal('string');
    });

    it('rejects task creation without authentication', async () => {
      const taskData = givenTaskData();

      await client.post('/tasks').send(taskData).expect(401);
    });

    it('validates required fields', async () => {
      const {token} = await givenLoggedInUser(client);

      await client
        .post('/tasks')
        .set(getAuthHeaders(token))
        .send({})
        .expect(422);
    });
  });

  describe('GET /tasks', () => {
    it('returns empty array when user has no tasks', async () => {
      const {token} = await givenLoggedInUser(client);

      const res = await client
        .get('/tasks')
        .set(getAuthHeaders(token))
        .expect(200);

      expect(Array.isArray(res.body)).to.be.true();
      expect(res.body.length).to.equal(0);
    });

    it('returns user tasks', async () => {
      const {token} = await givenLoggedInUser(client);

      const task1 = givenTaskData({title: 'Task 1'});
      const task2 = givenTaskData({title: 'Task 2'});

      await client.post('/tasks').set(getAuthHeaders(token)).send(task1);
      await client.post('/tasks').set(getAuthHeaders(token)).send(task2);

      const res = await client
        .get('/tasks')
        .set(getAuthHeaders(token))
        .expect(200);

      expect(Array.isArray(res.body)).to.be.true();
      expect(res.body.length).to.equal(2);

      // Verify that both tasks exist, regardless of order
      const titles = res.body.map((task: any) => task.title);
      expect(titles).to.containEql('Task 1');
      expect(titles).to.containEql('Task 2');

      // Verify properties of each task
      res.body.forEach((task: any) => {
        expect(task).to.have.properties([
          'id',
          'title',
          'description',
          'completed',
          'userId',
          'createdAt',
          'updatedAt',
        ]);
        expect(typeof task.id).to.equal('string');
        expect(typeof task.userId).to.equal('string');
        expect(task.completed).to.equal(false);
      });
    });

    it('rejects request without authentication', async () => {
      await client.get('/tasks').expect(401);
    });
  });

  describe('Task isolation between users', () => {
    it('only returns tasks for authenticated user', async () => {
      const {token: token1} = await givenLoggedInUser(client, {
        email: 'user1@test.com',
      });
      const {token: token2} = await givenLoggedInUser(client, {
        email: 'user2@test.com',
      });

      await client
        .post('/tasks')
        .set(getAuthHeaders(token1))
        .send(givenTaskData({title: 'User 1 Task'}));

      await client
        .post('/tasks')
        .set(getAuthHeaders(token2))
        .send(givenTaskData({title: 'User 2 Task'}));

      const res1 = await client
        .get('/tasks')
        .set(getAuthHeaders(token1))
        .expect(200);

      const res2 = await client
        .get('/tasks')
        .set(getAuthHeaders(token2))
        .expect(200);

      expect(res1.body.length).to.equal(1);
      expect(res1.body[0].title).to.equal('User 1 Task');

      expect(res2.body.length).to.equal(1);
      expect(res2.body[0].title).to.equal('User 2 Task');
    });
  });

  describe('Task CRUD operations', () => {
    it('performs complete CRUD cycle', async () => {
      const {token} = await givenLoggedInUser(client);

      // CREATE
      const createRes = await client
        .post('/tasks')
        .set(getAuthHeaders(token))
        .send(givenTaskData({title: 'CRUD Test Task'}));

      const taskId = createRes.body.id;
      expect(createRes.body.title).to.equal('CRUD Test Task');

      // READ
      const readRes = await client
        .get(`/tasks/${taskId}`)
        .set(getAuthHeaders(token))
        .expect(200);

      expect(readRes.body.id).to.equal(taskId);
      expect(readRes.body.title).to.equal('CRUD Test Task');

      // UPDATE
      await client
        .patch(`/tasks/${taskId}`)
        .set(getAuthHeaders(token))
        .send({title: 'Updated Task'})
        .expect(204);

      const updatedRes = await client
        .get(`/tasks/${taskId}`)
        .set(getAuthHeaders(token))
        .expect(200);

      expect(updatedRes.body.title).to.equal('Updated Task');

      // DELETE
      await client
        .delete(`/tasks/${taskId}`)
        .set(getAuthHeaders(token))
        .expect(204);

      await client
        .get(`/tasks/${taskId}`)
        .set(getAuthHeaders(token))
        .expect(404);
    });

    it('marks task as completed and uncompleted', async () => {
      const {token} = await givenLoggedInUser(client);

      const createRes = await client
        .post('/tasks')
        .set(getAuthHeaders(token))
        .send(givenTaskData({completed: false}));

      const taskId = createRes.body.id;

      // Mark as completed
      await client
        .patch(`/tasks/${taskId}/complete`)
        .set(getAuthHeaders(token))
        .expect(204);

      let res = await client
        .get(`/tasks/${taskId}`)
        .set(getAuthHeaders(token))
        .expect(200);

      expect(res.body.completed).to.equal(true);

      // Mark as uncompleted
      await client
        .patch(`/tasks/${taskId}/uncomplete`)
        .set(getAuthHeaders(token))
        .expect(204);

      res = await client
        .get(`/tasks/${taskId}`)
        .set(getAuthHeaders(token))
        .expect(200);

      expect(res.body.completed).to.equal(false);
    });
  });

  describe('GET /tasks/count', () => {
    it('returns correct task count', async () => {
      const {token} = await givenLoggedInUser(client);

      let res = await client
        .get('/tasks/count')
        .set(getAuthHeaders(token))
        .expect(200);
      expect(res.body.count).to.equal(0);

      await client
        .post('/tasks')
        .set(getAuthHeaders(token))
        .send(givenTaskData());

      res = await client
        .get('/tasks/count')
        .set(getAuthHeaders(token))
        .expect(200);
      expect(res.body.count).to.equal(1);
    });
  });
});
