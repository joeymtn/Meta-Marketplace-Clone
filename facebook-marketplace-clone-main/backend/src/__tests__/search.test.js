const http = require('http');
const db = require('./db');
const app = require('../app');
const supertest = require('supertest');
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

const firstResponse = {
  'id': 'e91a7d62-ac38-4a9a-a32c-06b27c051cb0',
  'category': '608eab18-05a5-4f03-a6c6-eb06e36f2b6d',
  'content': {
    'price': '$4084.41',
    'title': 'Galant',
    'created': '7/12/2021',
    'location': 'California',
    'username': 'abunker1',
    'imageLink': 'http://dummyimage.com/157x100.png/5fa2dd/ffffff',
    'description': 'Mitsubishi',
  },
};

const areEqualListings = (listing1, listing2) => {
  if (listing1.category !== listing2.category) {
    return false;
  } else if (listing1.content.price !== listing2.content.price) {
    return false;
  } else if (listing1.content.title !== listing2.content.title) {
    return false;
  } else if (listing1.content.created !== listing2.content.created) {
    return false;
  } else if (listing1.content.location !== listing2.content.location) {
    return false;
  } else if (listing1.content.username !== listing2.content.username) {
    return false;
  } else if (listing1.content.imageLink !== listing2.content.imageLink) {
    return false;
  }
  return true;
};

test('GET Without keyword', async () => {
  await request.get('/v0/search')
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.length).toEqual(12);
      expect(areEqualListings(data.body[0], firstResponse)).toEqual(true);
    });
});

test('GET With unknown keyword', async () => {
  await request.get('/v0/search?keyword=zzzz')
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.length).toEqual(0);
    });
});

test(`GET With 'LHS' keyword`, async () => {
  await request.get('/v0/search?keyword=LHS')
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.length).toEqual(1);
      expect(data.body[0].content.title).toEqual('LHS');
      expect(data.body[0].content.description).toEqual('Chrysler');
    });
});
