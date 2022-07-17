const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

// @TODO: Check if you can access same resources after logging out
//       same access token

// @TODO: Need to access something with wrong token

// ? Do we need to cover case with loggin in twice.

// ? Do we care about case sensitivity on emails

const body1 = { // Missing attributes name
  'email': 'ucscStudent@ucsc.edu',
  'password': 'yoooooo',
  'phone': '8314590111',
};
test('POST Signup with missing attributes', async () => {
  await request.post('/v0/signUp')
    .send(body1)
    .expect(400);
});

const body2 = { // Incorrect email format
  'name': 'Sammy Slug',
  'email': 'ucscStudentucsc.edu',
  'password': 'yoooooo',
  'phone': '8314590111',
};
test('POST Signup with incorrect email', async () => {
  await request.post('/v0/signUp')
    .send(body2)
    .expect(400);
});

const body3 = { // Valid user
  'name': 'Sammy Slug',
  'email': 'ucscStudent@ucsc.edu',
  'password': 'yoooooo',
  'phone': '8314590111',
};
test('POST Signup with a valid user', async () => {
  await request.post('/v0/signUp')
    .send(body3)
    .expect(200);
});
test('POST Signup with the same user', async () => {
  await request.post('/v0/signUp')
    .send(body3)
    .expect(409);
});

const body4 = { // Incorrect login email
  'email': 'ucscStudentucsc.edu',
  'password': 'yoooooo',
};
test('POST Login with incorrect email', async () => {
  await request.post('/v0/login')
    .send(body4)
    .expect(400);
});

const body5 = { // Incorrect login password
  'email': 'ucscStudent@ucsc.edu',
  'password': 'hehehehee',
};
test('POST Login with incorrect password', async () => {
  await request.post('/v0/login')
    .send(body5)
    .expect(401);
});

const body6 = { // Valid user
  'email': 'ucscStudent@ucsc.edu',
  'password': 'yoooooo',
};
let JWTtoken = undefined;
test('POST Login with correct login info', async () => {
  await request.post('/v0/login')
    .send(body6)
    .expect(201)
    .expect('Content-Type', /json/)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      expect(data.body.name).toBe('Sammy Slug');
      JWTtoken = data.body.accessToken;
      expect(JWTtoken).toBeDefined();
    });
});

// @TODO Create tests with unknown email
const body7 = { // Valid user
  'email': 'dummyEmail@ucsc.edu',
  'password': 'yoooooo',
};
test('POST Login with unknown email', async () => {
  await request.post('/v0/login')
    .send(body7)
    .expect(401);
});

// @TODO Unsure if needed to implement test
// test('DELETE Logout without jwt token', async () => {
//   await request.delete('/v0/logout').expect(401);
// });
// test('DELETE Logout with jwt token', async () => {
//   await request.delete('/v0/logout')
//     .set('Authorization', `Bearer ${JWTtoken}}`)
//     .expect(204);
// });
