import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import * as React from 'react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {getOnlyVisible, getNotVisible} from './common';
import TestContext from './TestContext';
import HomePage from '../Home/HomePage';

const host = 'http://localhost:3010';

/**
 * Default server interceptor is Unresponsive server
 */
const server = setupServer(
  rest.get(host + '/v0/category', (req, res, ctx) => {
    return res(ctx.json([{'name': 'Vehicle', 'id': '1234567'}]));
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

const doRender= () => {
  render(
    <TestContext updateTest={(items, func) => undefined}>
      <HomePage/>
    </TestContext>,
  );
};

test('Title bar exists on render', async () => {
  doRender();
  getOnlyVisible('facebook');
});

test(`Category prompt exists after pressing
  'All Categories' button`, async () => {
  doRender();
  const openCategoryDrawer = screen.getByText('All Categories');
  fireEvent.click(openCategoryDrawer);
  await waitFor(() => screen.getByText('Select Category'));
});

test(`Category prompt closes after pressing 'X' button`, async () => {
  doRender();
  const openCategoryDrawer = screen.getByText('All Categories');
  fireEvent.click(openCategoryDrawer);
  await waitFor(() => fireEvent.click(screen
    .getByLabelText('button__closeDrawer')));
  await waitFor(() => getNotVisible('Select Category'));
});
