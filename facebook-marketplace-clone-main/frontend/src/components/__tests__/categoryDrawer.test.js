import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import * as React from 'react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import CategoryDrawer from '../Home/CategoryDrawer';
import TestContext from './TestContext';

const host = 'http://localhost:3010';

const server = setupServer(
  rest.get(host + '/v0/category', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      {'name': 'Vehicle', 'id': '11111111'},
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
const updateState = (items) => {
  state = items;
};

const doRender= () => {
  render(
    <TestContext updateTest={updateState}>
      <CategoryDrawer/>
    </TestContext>,
  );
};

test('Category is selected', async () => {
  doRender();
  await waitFor(() => screen.getByText('Select Category'));
  fireEvent.click(await waitFor(() => screen.getByText('Vehicle')));
  expect(state.currentCategory).toBe('11111111');
  expect(state.pressCategory).toBe(false);
});

test('Close drawer', async () => {
  doRender();
  await waitFor(() => screen.getByLabelText('button__closeDrawer'));
  fireEvent.click(await waitFor(() =>
    screen.getByLabelText('button__closeDrawer')));
  expect(state.pressCategory).toBe(false);
});
