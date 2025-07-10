import {Client, expect} from '@loopback/testlab';
import {TestApplication} from './test-application';
import {givenUserData, setupApplication} from './test-helper';

describe('AuthController (Simple Integration)', () => {
  let app: TestApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  describe('POST /auth/register', () => {
    it('successfully registers a new user', async () => {
      const userData = givenUserData();

      const res = await client
        .post('/auth/register')
        .send(userData)
        .expect(200);

      expect(res.body).to.have.properties(['message', 'user']);
      expect(res.body.message).to.equal('User registered successfully');
      expect(res.body.user).to.have.properties([
        'id',
        'name',
        'email',
        'createdAt',
      ]);
      expect(res.body.user.email).to.equal(userData.email);
      expect(res.body.user.name).to.equal(userData.name);
      expect(res.body.user).to.not.have.property('password');
    });

    it('rejects registration with duplicate email', async () => {
      const userData = givenUserData({email: 'duplicate@test.com'});

      await client.post('/auth/register').send(userData).expect(200);

      const res = await client
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(res.body.error.message).to.equal('Email already in use');
    });

    it('validates required fields', async () => {
      await client.post('/auth/register').send({}).expect(422);
    });
  });

  describe('POST /auth/login', () => {
    it('successfully logs in with valid credentials', async () => {
      const userData = givenUserData({
        email: 'login@test.com',
        password: 'validpassword',
      });

      await client.post('/auth/register').send(userData).expect(200);

      const res = await client
        .post('/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(res.body).to.have.properties(['message', 'token', 'user']);
      expect(res.body.message).to.equal('Login successful');
      expect(typeof res.body.token).to.equal('string');
      expect(res.body.user).to.have.properties(['id', 'name', 'email']);
      expect(res.body.user.email).to.equal(userData.email);
    });

    it('rejects login with invalid credentials', async () => {
      const res = await client
        .post('/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'anypassword',
        })
        .expect(401);

      expect(res.body.error.message).to.equal('Incorrect email or password');
    });
  });

  describe('JWT Token Validation', () => {
    it('generates valid JWT token format', async () => {
      const userData = givenUserData({
        email: 'jwt@test.com',
        password: 'testpassword',
      });

      await client.post('/auth/register').send(userData).expect(200);
      const loginRes = await client
        .post('/auth/login')
        .send({email: userData.email, password: userData.password})
        .expect(200);

      const token = loginRes.body.token;
      const parts = token.split('.');
      expect(parts.length).to.equal(3);

      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      expect(payload).to.have.properties(['userId', 'email', 'name', 'iat']);
      expect(payload.email).to.equal(userData.email);
      expect(payload.name).to.equal(userData.name);
    });
  });
});
