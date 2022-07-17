const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

const listingAuth = { // Creates account for testing creating listing
  'name': 'Listing Account',
  'email': 'listAccount@ucsc.edu',
  'password': 'listing',
  'phone': '555-423-3242',
};

const correctListing = {
  user_id: undefined,
  category_id: '117aa2e1-4228-406d-8402-b3d2e3dd611d',
  content: {
    title: 'Toyoto Prius 2020',
    description: 'Get this car today',
    imageLink: 'https://www.motortrend.com/uploads/sites/10/2019/07/2020-toyota-prius-prime-xle-5door-hatchback-angular-front.png?fit=around%7C958:598.75',
    username: listingAuth.name,
    created: new Date().toISOString(),
    make: 'Toyoto',
    type: 'Prius',
    color: 'Silver',
    mileage: '1000miles',
  },
};

let listingToken = undefined;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

/** Test gets the auth token given a user sign up */
test('GET auth Token', async () => {
  await request.post('/v0/signUp')
    .send(listingAuth);
  const data = await request.post('/v0/login')
    .send({
      email: listingAuth.email,
      password: listingAuth.password,
    });
  listingToken = data.body;
  correctListing.user_id = data.body.id;
  expect(listingToken).toBeDefined();
});


/** Attempts to create a listing with no authorization */
test('POST Create Listing with no auth token', async () => {
  await request.post('/v0/listing')
    .send(correctListing)
    .expect(401);
});

/** Attempts to create a listing with incorrect Token */
test('POST Create Listing with incorrect auth token', async () => {
  await request.post('/v0/listing')
    .set('Authorization', 'bearer ' + 'incorrectToken')
    .send(correctListing)
    .expect(403);
});

// Attempt to send with some missing properties from listing
test('POST Create Listing with incorrect format', async () => {
  await request.post('/v0/listing')
    .set('Authorization', 'bearer ' + listingToken.accessToken)
    .send({
      user_id: correctListing.user_id,
      category_id: correctListing.category_id,
    })
    .expect(400);
});

// Missing foregin keys
test('POST Create Listing with foreign keys not in tables', async () => {
  await request.post('/v0/listing')
    .set('Authorization', 'bearer ' + listingToken.accessToken)
    .send({
      content: correctListing.content,
    })
    .expect(400);
});

// Attempt to send with some foreign keys not from table
test('POST Create Listing with missing IDs', async () => {
  await request.post('/v0/listing')
    .set('Authorization', 'bearer ' + listingToken.accessToken)
    .send({
      user_id: 'b6812d72-94fb-4c07-9aee-05d7dff8795e',
      category_id: '69576b52-1203-4834-aa79-bb652a573b74',
      content: correctListing.content,
    })
    .expect(404);
});

let newListingID = undefined;

// Correct listing
test('POST Create Listing with with correct info', async () => {
  await request.post('/v0/listing')
    .set('Authorization', 'bearer ' + listingToken.accessToken)
    .send(correctListing)
    .expect(201)
    .then((data) => {
      expect(data.body).toBeDefined();
      expect(data.body.id).toBeDefined();
      newListingID = data.body.id;
      expect(data.body.user_id).toBe(correctListing.user_id);
      expect(data.body.category_id).toBe(correctListing.category_id);
      Object.keys(data.body.content).map((ele) => {
        expect(data.body.content[ele]).toBe(correctListing.content[ele]);
      });
    });
});

// Checks if newListing is in database
test('GET Newly created Listing', async () => {
  await request.get('/v0/listing')
    .query({category: correctListing.category_id})
    .expect(200)
    .then((data) => {
      expect(data.body.find((ele) => ele.id === newListingID)).toBeDefined();
    });
});

test('get valid user data', async () => {
  await request.get('/v0/userlisting')
    .set('Authorization', 'bearer ' + listingToken.accessToken)
    .query({users_id: correctListing.user_id})
    .expect(200)
    .then((data) => {
      expect(data.body).toBeDefined();
      expect(data.body.length).toBe(1);
      expect(data.body[0].users_id).toBe(correctListing.user_id);
    });
});

test('get invalid user data should return empty []', async () => {
  await request.get('/v0/userlisting')
    .set('Authorization', 'bearer ' + listingToken.accessToken)
    .query({users_id: '7fab0b73-f22f-4ccc-a85c-777d987657c5'})
    .expect(200);
});

test('get invalid user auth', async () => {
  await (request.get('/v0/userListing'))
    .set('Authorization', 'bearer + ' + 'fake1234')
    .query({users_id: '7fab0b73-f22f-4ccc-a85c-777d987657c5'})
    .expect(403);
});
