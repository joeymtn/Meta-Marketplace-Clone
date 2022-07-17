import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {getNotVisible} from './common';

import App from '../App';
import {getClickable, getOnlyVisible,
  getManyVisible} from './common';

const host = 'http://localhost:3010';
const loginURL = '/v0/login';
const signUpURL = '/v0/signUp';
const categories = [
  {'name': 'Vehicle', 'id': '11111111'},
  {'name': 'Real Estate', 'id': '22222222'},
];
/**
 * Default server interceptor is Unresponsive server
 */
const server = setupServer(
  rest.get(host + '/v0/userListing', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(categories));
  }),
  rest.get(host + '/v0/category', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(categories));
  }),
  rest.get(host + '/v0/listing', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  rest.post(host + '/v0/listing', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
);

beforeAll(() => {
  server.listen();
  window.alert = jest.fn();
});
beforeEach(() => {
  // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
  window.history.pushState({}, '', '/');
  render(<App />);
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());


test('Create New List redirects to Login Route', async () => {
  fireEvent.click(screen.getByRole('button', {name: 'create'}));
  await waitFor(() => expect(global.window.location.pathname)
    .toEqual('/login'));
});


test('User List redirects to Login Route', async () => {
  fireEvent.click(screen.getByRole('button', {name: 'my listings'}));
  await waitFor(() => expect(global.window.location.pathname)
    .toEqual('/login'));
});


/**
 * Navigates from the Home Page to the Login Page
 * and checks if all the main Log in Components are there
 */
test('Login Button navigates to Login Page', async () => {
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  getOnlyVisible('Email');
  getOnlyVisible('Password');
  getClickable('Login');
  getClickable('Create New Account');
});


const correctUser = {
  email: 'sammySlug@ucsc.edu',
  password: 'sammy',
};

const correctResponse = {
  id: 'd68be2c6-2845-47b0-a4b7-90b4dba57b38',
  name: 'Sammy Slug',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
};
/**
 * Overrides server interceptor to have the login route
 * @param {Boolean} error - boolean for when server is down
 */
const loginRoute = (error) => {
  server.use(
    rest.post(host + loginURL, (req, res, ctx) => {
      if (error) {
        return res(ctx.status(500));
      } else if (req.body.email === '' || req.body.password === '') {
        return res(ctx.status(400));
      } else if (req.body.email === correctUser.email ||
        req.body.password === correctUser.password) {
        return res(ctx.status(201), ctx.json(correctResponse));
      } else {
        return res(ctx.status(401));
      }
    }),
  );
};


/**
 * Navigates back to Home page by clicking on title
 */
test('Login title bar navigates back to homepage', async () => {
  loginRoute(false);
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  fireEvent.click(screen.getByText('facebook'));
  await waitFor(() => expect(global.window.location.pathname)
    .toEqual('/'));
});


/**
 * Navigates back to Login page by clicking on title
 */
test('Signup title bar navigates back to Login', async () => {
  loginRoute(false);
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  fireEvent.click(getClickable('Create New Account'));
  fireEvent.click(screen.getByText('Join Facebook'));
  await waitFor(() => expect(global.window.location.pathname)
    .toEqual('/login'));
});

/**
 * Navigates from the Home Page to the Login Page
 * and tries to log in with no email and password
 */
test('Login with no Email or Password', async () => {
  loginRoute(false);
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  fireEvent.click(getClickable('Login'));
  await waitFor(() => screen.getAllByText('Email or Password incorrect'));
  getManyVisible('Email or Password incorrect', 2);
});

/**
 * Navigates to the Login Page and logins with incorrect Email
 * or Password. Error text should show up on the login form
 */
test('Login with incorrect Email or Password', async () => {
  loginRoute(false);
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  const email = screen.getByLabelText('Email');
  const password = screen.getByLabelText('Password');

  await waitFor(() => {
    fireEvent.change(email, {target: {value: 'incorrectEmail@ucsc.edu'}});
  });
  await waitFor(() => {
    fireEvent.change(password, {target: {value: 'incorrectPassword'}});
  });
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  await waitFor(() => screen.getAllByText('Email or Password incorrect'));
  getManyVisible('Email or Password incorrect', 2);
});

/**
 * Navigates to the login Page and logins with correct info
 * Checks if the token is stored and page is navigated to home
 */
test('Login with correct Info', async () => {
  loginRoute(false);
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  const email = screen.getByLabelText('Email');
  const password = screen.getByLabelText('Password');
  await waitFor(() => {
    fireEvent.change(email, {target: {value: correctUser.email}});
  });
  await waitFor(() => {
    fireEvent.change(password, {target: {value: correctUser.password}});
  });

  fireEvent.click(getClickable('Login'));
  // Waits for route to change
  await waitFor(() => expect(global.window.location.pathname).toEqual('/'));
  const user = JSON.parse(global.localStorage.getItem('user'));
  expect(user.id).toBe(correctResponse.id);
  expect(user.name).toBe(correctResponse.name);
  expect(user.accessToken).toBe(correctResponse.accessToken);
});

/**
 * Attempts to log in when server is not responding
 * Should display an error message
 */
test('Login with Server not working', async () => {
  loginRoute(true);
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  const email = screen.getByLabelText('Email');
  const password = screen.getByLabelText('Password');
  fireEvent.change(email, {target: {value: correctUser.email}});
  fireEvent.change(password, {target: {value: correctUser.password}});
  fireEvent.click(getClickable('Login'));
  await waitFor(() => expect(window.alert)
    .toBeCalledWith('ERROR: 500'));
});

/**
 * Navigates from the Login Page to SignUp Component
 * and checks if initial signup Components are there
 */
test('Sign Up button navigates to Signup Component', async () => {
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  fireEvent.click(getClickable('Create New Account'));
  getOnlyVisible('First Name');
  getOnlyVisible('Last Name');
  getOnlyVisible('Next');
});

const correctSignUp = {
  firstName: 'David',
  lastName: 'Harrison',
  phone: '831-459-5496',
  email: 'dcharris@ucsc.edu',
  password: 'CSE183',
};

/**
 * Overrides server interceptor to have the signUp route
 * @param {Boolean} error - boolean for when server is down
 */
const signUpRoute = (error) => {
  server.use(
    rest.post(host + signUpURL, (req, res, ctx) => {
      if (error) {
        return res(ctx.status(500));
      } else if (req.body.email !== correctUser.email) {
        return res(ctx.status(200));
      } else {
        return res(ctx.status(409));
      }
    }),
  );
};

/**
 * This test goes through the Sign Up components and checks
 * if all the form validations work
 */
test('SignUp validation works with all info', async () => {
  signUpRoute(false);
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  fireEvent.click(getClickable('Create New Account'));

  // Validates No Name
  fireEvent.click(getClickable('Continue-SignUp'));
  getManyVisible('Required', 2);
  await waitFor(() => fireEvent.change(screen.getByLabelText('first-name-input')
    .querySelector('Input'), {target: {value: correctSignUp.firstName}}));
  await waitFor(() => fireEvent.change(screen.getByLabelText('last-name-input')
    .querySelector('Input'), {target: {value: correctSignUp.lastName}}));
  fireEvent.click(getClickable('Continue-SignUp'));

  // Checks and Validates Email Form
  getOnlyVisible('Email');
  getOnlyVisible('Next');
  fireEvent.click(getClickable('Continue-SignUp'));
  getOnlyVisible('Email must be formated as XXX@XXXX.XXX');
  await waitFor(() => fireEvent.change(screen.getByLabelText('email-input')
    .querySelector('Input'), {target: {value: 'dcharris.edu'}}));
  fireEvent.click(getClickable('Continue-SignUp'));
  getOnlyVisible('Email must be formated as XXX@XXXX.XXX');
  await waitFor(() => fireEvent.change(screen.getByLabelText('email-input')
    .querySelector('Input'), {target: {value: correctSignUp.email}}));
  fireEvent.click(getClickable('Continue-SignUp'));

  // Checks and validates Phone Number Form
  getOnlyVisible('Phone Number');
  getOnlyVisible('Next');
  fireEvent.click(getClickable('Continue-SignUp'));
  getOnlyVisible('Phone number must be formated as (XXX) XXX-XXXX');
  await waitFor(() => fireEvent.change(screen.getByLabelText('phone-input')
    .querySelector('Input'), {target: {value: '12-12-1234'}}));
  fireEvent.click(getClickable('Continue-SignUp'));
  getOnlyVisible('Phone number must be formated as (XXX) XXX-XXXX');
  await waitFor(() => fireEvent.change(screen.getByLabelText('phone-input')
    .querySelector('Input'), {target: {value: correctSignUp.phone}}));
  fireEvent.click(getClickable('Continue-SignUp'));

  // Checks and Validates Password Form
  getOnlyVisible('Password');
  getOnlyVisible('Submit');
  fireEvent.click(getClickable('Continue-SignUp'));
  getOnlyVisible('Password requires more than 6 characters');
  await waitFor(() => fireEvent.change(screen.getByLabelText('password-input')
    .querySelector('Input'), {target: {value: 'aaaaa'}}));
  fireEvent.click(getClickable('Continue-SignUp'));
  getOnlyVisible('Password requires more than 6 characters');
  await waitFor(() => fireEvent.change(screen.getByLabelText('password-input')
    .querySelector('Input'), {target: {value: correctSignUp.password}}));
  fireEvent.click(getClickable('Continue-SignUp'));
});


/**
 * Function inputs the correct sign up info to signup component
 * to get to get to the confirmation component
 * @param {Boolean} error - tests whether the confirmation component is
 *                          successful or not.
 *                          true - Error
 *                          flase - successful
 */
const toConfirmation = async (error) => {
  fireEvent.click(screen.getAllByRole('button', {name: 'Login'})[0]);
  fireEvent.click(getClickable('Create New Account'));

  // Validates No Name
  await waitFor(() => fireEvent.change(screen.getByLabelText('first-name-input')
    .querySelector('Input'), {target: {value: correctSignUp.firstName}}));
  await waitFor(() => fireEvent.change(screen.getByLabelText('last-name-input')
    .querySelector('Input'), {target: {value: correctSignUp.lastName}}));
  fireEvent.click(getClickable('Continue-SignUp'));

  // Checks and Validates Email Form
  const email = error ? correctUser.email : correctSignUp.email;
  await waitFor(() => fireEvent.change(screen.getByLabelText('email-input')
    .querySelector('Input'), {target: {value: email}}));
  fireEvent.click(getClickable('Continue-SignUp'));

  // Checks and validates Phone Number Form
  await waitFor(() => fireEvent.change(screen.getByLabelText('phone-input')
    .querySelector('Input'), {target: {value: correctSignUp.phone}}));
  fireEvent.click(getClickable('Continue-SignUp'));

  // Checks and Validates Password Form
  await waitFor(() => fireEvent.change(screen.getByLabelText('password-input')
    .querySelector('Input'), {target: {value: correctSignUp.password}}));
  fireEvent.click(getClickable('Continue-SignUp'));
  await waitFor(() => screen.getAllByText('Login'));
};

/** Checks if there's an error confirmation for a known email */
test('SignUp with known email', async () => {
  signUpRoute(false);
  await toConfirmation(true);
  expect(global.window.location.pathname).toEqual('/signup/confirm');
  getOnlyVisible('Login');
  getOnlyVisible('Join');
});

/** Checks if there's an successful confirmation for a unknown email */
test('SignUp with unknown email', async () => {
  signUpRoute(false);
  await toConfirmation(false);
  expect(global.window.location.pathname).toEqual('/signup/confirm');
  getOnlyVisible('Login');
});

/** Handles server not working */
test('SignUp with Server not working', async () => {
  signUpRoute(true);
  await toConfirmation(false);
  await waitFor(() => expect(window.alert)
    .toBeCalledWith('ERROR: 500'));
  expect(global.window.location.pathname).toEqual('/login');
});

/** Checks if login button in the confirmation component works */
test('SignUp confirmation Login works', async () => {
  signUpRoute(false);
  await toConfirmation(true);
  await waitFor(() => expect(global.window.location.pathname)
    .toEqual('/signup/confirm'));
  fireEvent.click(screen.getByLabelText('Login'));
  await waitFor(() => expect(global.window.location.pathname)
    .toEqual('/login'));
});


/** Checks if Join button in the confirmation component works */
test('SignUp confirmation Join button works', async () => {
  signUpRoute(false);
  await toConfirmation(true);
  await waitFor(() => expect(global.window.location.pathname)
    .toEqual('/signup/confirm'));
  fireEvent.click(screen.getByLabelText('Join'));
  await waitFor(() => expect(global.window.location.pathname)
    .toEqual('/signup'));
});

/** I want to be able to login on a user with no listings and see
 *  if I am able to view listings that I click on
 *  I want to be able to click on the button without proper authentication
 *  and see if I can login there
 *  I want to be able to
 */
test('create new user, display no lists', async () => {
  await waitFor(() => fireEvent.click(screen.getByText('My Listings')));
  const img = document.querySelectorAll('img');
  expect(img.length).toBe(0);
});

test('logged in, not redirecting to home page', async () => {
  await waitFor(() => fireEvent.click(screen.getByText('My Listings')));
  await waitFor(() => getNotVisible('email'));
});

/**
 * Navigates from the Login Page to SignUp Component
 * and checks if initial signup Components are there
 */
test('Check that drawer shows up', async () => {
  fireEvent.click(screen.getByRole('button',
    {name: 'create'}));
  await waitFor(() => screen.getByText('Vehicle For Sale'));
});

test('create listing, query for visible images, async', async () => {
  await waitFor(() => fireEvent.click(screen.getByText('Create New Listing')));
  fireEvent.change(screen.getByLabelText('Photo URL', {selector: 'input'}),
    {target: {value: 'https://media.wired.com/photos/5d09594a62bcb0c9752779d9/1:1/w_1500,h_1500,c_limit/Transpo_G70_TA-518126.jpg'}});
  fireEvent.change(screen.getByLabelText('Make',
    {selector: 'input'}), {target: {value: 'Honda'}});
  fireEvent.change(screen.getByLabelText('Color',
    {selector: 'input'}), {target: {value: 'Blue'}});
  fireEvent.change(screen.getByLabelText('Mileage',
    {selector: 'input'}), {target: {value: '1000'}});
  fireEvent.change(screen.getByLabelText('Price', {selector: 'input'}),
    {target: {value: '32,000'}});
  fireEvent.change(screen.getByLabelText('Description', {selector: 'textarea'}),
    {target: {value: 'New'}});
  await waitFor(() => fireEvent.click(screen.getByText('Submit')));
  await waitFor(() => fireEvent.click(screen.getByText('My Listings')));
  const img = window.document.querySelectorAll('img');
  expect(img.length).toBe(0);
});
