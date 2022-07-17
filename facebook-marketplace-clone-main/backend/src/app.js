const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

// const dummy = require('./dummy');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

const authRoute = require('./authenication');
const category = require('./category');
const listings = require('./listings');
const search = require('./search');


// Authenication Routes
app.post('/v0/login', authRoute.authenticate);
app.post('/v0/signUp', authRoute.signUp);
app.get('/v0/category', category.getCategory);
app.get('/v0/listing', listings.getAllListings);
app.get('/v0/userListing', authRoute.check, listings.getUserListings);
app.post('/v0/listing', authRoute.check, listings.createAListing);
app.get('/v0/search', search.getListing);


app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
