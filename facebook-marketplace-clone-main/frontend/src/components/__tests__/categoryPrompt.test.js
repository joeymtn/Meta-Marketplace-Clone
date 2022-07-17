import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import * as React from 'react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {getOnlyVisible} from './common';
import CategoryPrompt from '../Home/CategoryPrompt';
import TestContext from './TestContext';

const host = 'http://localhost:3010';

const server = setupServer(
  rest.get(host + '/v0/category', (req, res, ctx) => {
    return res(ctx.status(200),
      ctx.json([{'name': 'Vehicle', 'id': '11111111'},
        {'name': 'Real Estate', 'id': '22222222'},
      ]));
  }),
  rest.get(host + '/v0/listing', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());


afterEach(() => {
  server.resetHandlers();
});

let state = {};
let setState;

const updateState = (items, func) => {
  state = items;
  setState = func;
};

const doRender= () => {
  render(
    <TestContext updateTest={updateState}>
      <CategoryPrompt/>
    </TestContext>,
  );
};

test('Default chips exist on render', async () => {
  doRender();
  getOnlyVisible('All Categories');
  getOnlyVisible('Sell');
});

test('Filter button exist on render', async () => {
  doRender();
  getOnlyVisible('Filters');
});

test(`Click on 'All Categories' chip`, async () => {
  doRender();
  await waitFor(() => screen.getByText('All Categories'));
  fireEvent.click(screen.getByText('All Categories'));
});

test(`Subcategory chips render correctly`, async () => {
  doRender();
  /** -------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = '11111111';
  state.currentSubcategory = [
    {'name': 'Car', 'id': '33333333'},
    {'name': 'Motorcycle', 'id': '44444444'},
  ];
  state.currentCategoryName = 'Vehicle';
  state.breadcrumbs = ['Vehicle'];
  /** -------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByText('Motorcycle'));
  fireEvent.click(screen.getByText('Motorcycle'));
  expect(state.currentCategory).toBe('44444444');
});

test(`Pressing on 'Marketplace' breadcrumb resets categories`, async () => {
  doRender();
  /** -------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = '11111111';
  state.currentSubcategory = [
    {'name': 'Car', 'id': '33333333'},
    {'name': 'Motorcycle', 'id': '44444444'},
  ];
  state.breadcrumbs = [{'name': 'Vehicle', 'id': '11111111'}];
  /** -------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByText('Marketplace'));
  fireEvent.click(screen.getByText('Marketplace'));
  expect(state.currentCategory).toBe(null);
  expect(state.currentCategoryName).toBe(null);
  expect(state.currentSubcategory).toBe(null);
  expect(state.breadcrumbs.length).toEqual(0);
});

test(`Pressing on previous breadcrumb updates category`, async () => {
  doRender();
  /** -------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = '33333333';
  state.currentCategoryName = 'Car';
  state.currentSubcategory = [{'name': 'SUV', 'id': '55555555'}];
  state.breadcrumbs = [
    {'name': 'Vehicle', 'id': '11111111'},
    {'name': 'Car', 'id': '33333333'},
  ];
  /** -------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByText('Vehicle'));
  fireEvent.click(screen.getByText('Vehicle'));
  expect(state.currentCategory).toBe('11111111');
  expect(state.currentCategoryName).toBe('Vehicle');
  expect(state.breadcrumbs).toEqual([{'name': 'Vehicle', 'id': '11111111'}]);
});

test(`Pressing on current breadcrumb does nothing`, async () => {
  doRender();
  /** -------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = '11111111';
  state.currentSubcategory = [
    {'name': 'Car', 'id': '33333333'},
    {'name': 'Motorcycle', 'id': '44444444'},
  ];
  state.currentCategoryName = 'Vehicle';
  state.breadcrumbs = [{'name': 'Vehicle', 'id': '11111111'}];
  /** -------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByText('Vehicle'));
  fireEvent.click(screen.getByText('Vehicle'));
  expect(state.currentCategory).toBe('11111111');
  expect(state.currentCategoryName).toBe('Vehicle');
  expect(state.breadcrumbs).toEqual([{'name': 'Vehicle', 'id': '11111111'}]);
});

const listings = [
  {
    'id': '123455677',
    'category': '11111111',
    'content': {
      'price': '$10,123.11',
      'category': '11111111',
      'title': 'Car 1',
      'created': '11/24/2021',
      'location': 'California',
      'username': 'sbyard4',
      'imageLink': 'http://dummyimage.com/156x100.png/5fa2dd/ffffff',
      'description': 'Fancy car',
    },
  },
  {
    'id': '123455688',
    'category': '11111111',
    'content': {
      'price': '$10,124.11',
      'category': '11111111',
      'title': 'Car 2',
      'created': '11/24/2021',
      'location': 'California',
      'username': 'sbyard4',
      'imageLink': 'http://dummyimage.com/156x100.png/5fa2dd/ffffff',
      'description': 'Simple Car',
    },
  },
];

test(`Searching marketplace with no keyword and no category`, async () => {
  doRender();
  /** --------------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = null;
  state.currentSubcategory = [];
  state.currentCategoryName = null;
  state.breadcrumbs = [];
  /** --------------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByLabelText('search'));
  await waitFor(() => fireEvent.change(screen.getByLabelText('search'),
    {target: {value: 'house'}}));
});

test(`Searching marketplace with 'house' keyword and no category`, async () => {
  doRender();
  /** --------------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = null;
  state.currentSubcategory = [];
  state.currentCategoryName = null;
  state.breadcrumbs = [];
  /** --------------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByLabelText('search'));
  await waitFor(() => fireEvent.change(screen.getByLabelText('search'),
    {target: {value: 'house'}}));
});

test(`Searching marketplace with no 
  keyword and 'Vehicle' category`, async () => {
  doRender();
  /** --------------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = '11111111';
  state.currentSubcategory = [
    {'name': 'Car', 'id': '33333333'},
    {'name': 'Motorcycle', 'id': '44444444'},
  ];
  state.currentCategoryName = 'Vehicle';
  state.breadcrumbs = [{'name': 'Vehicle', 'id': '11111111'}];
  /** --------------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByLabelText('search'));
});

test(`Searching marketplace with 'house' 
  keyword and 'Vehicle' category`, async () => {
  doRender();
  /** --------------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = '11111111';
  state.currentSubcategory = [
    {'name': 'Car', 'id': '33333333'},
    {'name': 'Motorcycle', 'id': '44444444'},
  ];
  state.currentCategoryName = 'Vehicle';
  state.breadcrumbs = [{'name': 'Vehicle', 'id': '11111111'}];
  /** --------------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByLabelText('search'));
  await waitFor(() => fireEvent
    .change(screen.getByLabelText('search'), {target: {value: 'house'}}));
});

test(`Searching marketplace with 'space' 
  keyword and 'Vehicle' category`, async () => {
  doRender();
  /** --------------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = '11111111';
  state.currentSubcategory = [
    {'name': 'Car', 'id': '33333333'},
    {'name': 'Motorcycle', 'id': '44444444'},
  ];
  state.currentCategoryName = 'Vehicle';
  state.breadcrumbs = [{'name': 'Vehicle', 'id': '11111111'}];
  /** --------------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByLabelText('search'));
  await waitFor(() => fireEvent.change(screen
    .getByLabelText('search'), {target: {value: ' '}}));
});

test(`Press on create new listing button`, async () => {
  doRender();
  /** --------------------------------------------------------------------- */
  // Setting up state
  state.currentCategory = '11111111';
  state.currentSubcategory = [{'name': 'Car', 'id': '33333333'},
    {'name': 'Motorcycle', 'id': '44444444'}];
  state.currentCategoryName = 'Vehicle';
  state.breadcrumbs = [{'name': 'Vehicle', 'id': '11111111'}];
  state.marketplaceListings = listings;
  state.user.accessToken = 123456789;
  state.createListing = false;
  /** --------------------------------------------------------------------- */
  setState(state);
  await waitFor(() => screen.getByText('Create New Listing'));
  fireEvent.click(screen.getByText('Create New Listing'));
});
