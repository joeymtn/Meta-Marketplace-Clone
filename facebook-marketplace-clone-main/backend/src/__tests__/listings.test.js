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

const firstRealEstate = {
  'id': '123455677',
  'category': '65e66254-47a7-4607-a9c9-2a2aa112dc03',
  'content': {
    'price': '$10,123.11',
    'category': '65e66254-47a7-4607-a9c9-2a2aa112dc03',
    'title': 'House 1',
    'created': '11/24/2021',
    'location': 'California',
    'username': 'sbyard4',
    'imageLink': 'http://dummyimage.com/156x100.png/5fa2dd/ffffff',
    'description': '4 Bedroom house with a huge bathtub',
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
test('GET All Listings', async () => {
  await request.get('/v0/listing')
    .expect(200)
    .then((data) => {
      expect(data).toBeDefined();
      expect(data.body).toBeDefined();
      expect(data.body.length).toEqual(12);
      expect(areEqualListings(data.body[0], firstResponse)).toEqual(true);
    });
});

test('GET all listings of category', async () => {
  await request.get('/v0/listing?category=65e66254-47a7-4607-a9c9-2a2aa112dc03')
    .expect(200)
    .then( (data) => {
      expect(data).toBeDefined();
      expect(data.body.length).toEqual(6);
    });
});

test('GET invalid id of category', async ()=> {
  await request.get('/v0/listing?category=cdfa7c99-1e3c-4cf6-bebe-7469ccb5b4b1')
    .expect(200)
    .then((data) => {
      expect(data.body).toEqual([]);
    });
});

test('GET all category of vehicle', async () => {
  await request.get('/v0/listing?category=608eab18-05a5-4f03-a6c6-eb06e36f2b6d')
    .expect(200)
    .then( (data) => {
      expect(data).toBeDefined();
      expect(data.body.length).toEqual(3);
      expect(areEqualListings(data.body[0], firstResponse)).toEqual(true);
    });
});

test('GET all listings of real estate', async () => {
  await request.get('/v0/listing?category=65e66254-47a7-4607-a9c9-2a2aa112dc03')
    .expect(200)
    .then( (data) => {
      expect(data).toBeDefined();
      expect(data.body.length).toEqual(6);
      expect(areEqualListings(data.body[0], firstRealEstate)).toEqual(true);
    });
});

test('GET Listing by keyword', async () => {
  await request.get('/v0/listing?keyword=ram')
    .expect(200)
    .then( (data) => {
      expect(data).toBeDefined();
      expect(data.body.length).toEqual(1);
      expect(data.body[0].content.title).toEqual('Ram 3500');
      expect(data.body[0].content.description).toEqual('Dodge');
    });
});

test('GET Listing by category and keyword', async () => {
  await request.get(`/v0/listing?` +
    `category=608eab18-05a5-4f03-a6c6-eb06e36f2b6d&keyword=mits`)
    .expect(200)
    .then( (data) => {
      expect(data).toBeDefined();
      expect(data.body.length).toEqual(1);
      expect(data.body[0].content.title).toEqual('Galant');
      expect(data.body[0].content.description).toEqual('Mitsubishi');
    });
});

