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

test('GET Invalid URL', async () => {
  await request.get('/v0/so-not-a-real-end-point-ba-bip-de-doo-da/')
    .expect(404);
});

test('GET All categories', async () => {
  await request.get('/v0/category')
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body[0].name).toEqual('Vehicle');
      expect(data.body[0].id).toEqual('608eab18-05a5-4f03-a6c6-eb06e36f2b6d');
      expect(data.body[1].name).toEqual('Real Estate');
      expect(data.body[1].id).toEqual('65e66254-47a7-4607-a9c9-2a2aa112dc03');
    });
});

test(`GET All subcategories of 'Vehicle' category`, async () => {
  await request.get('/v0/category?parent=608eab18-05a5-4f03-a6c6-eb06e36f2b6d')
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body[0].name).toEqual('Motorcycle');
      expect(data.body[0].id).toEqual('fdfcf56a-58f7-404f-8a84-5bec9a26643c');
      expect(data.body[1].name).toEqual('Car');
      expect(data.body[1].id).toEqual('00d55315-cf9c-456e-bbf6-9360a10f8a2f');
    });
});

test(`GET All subcategories of 'Real Estate' category`, async () => {
  await request.get('/v0/category?parent=65e66254-47a7-4607-a9c9-2a2aa112dc03')
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body[0].name).toEqual('House');
      expect(data.body[0].id).toEqual('2927ac2b-0167-444a-9b8b-582476cea093');
      expect(data.body[1].name).toEqual('Apartment');
      expect(data.body[1].id).toEqual('117aa2e1-4228-406d-8402-b3d2e3dd611d');
    });
});

test(`GET Invalid category`, async () => {
  await request.get('/v0/category?parent=54e66254-47a7-4607-a9c9-2a2aa112dc14')
    .expect(200)
    .then((data) => {
      expect(data.body.length).toEqual(0);
    });
});
