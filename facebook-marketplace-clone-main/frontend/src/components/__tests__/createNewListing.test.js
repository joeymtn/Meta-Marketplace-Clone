import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import * as React from 'react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import TestContext from './TestContext';
import NewListingForm from '../Listings/NewListingForm';

const host = 'http://localhost:3010';

const server = setupServer(
  rest.post(host + '/v0/listing', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  rest.get(host + '/v0/listing', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  rest.get(host + '/v0/category', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

let state = {};

const updateState = (items, func) => {
  state = items;
};


const defaultState = {
  user: {id: '2131231', username: 'example', accessToken: 'kd23kdf23kdls'},
  globalCategory: [
    {id: '12313', name: 'Vehicle'},
    {id: '14676', name: 'Real Estate'},
  ],
  creatingListing: true,
};

const doRender= () => {
  render(
    <TestContext updateTest={updateState} defaultState={defaultState}>
      <NewListingForm/>
    </TestContext>,
  );
};

test('Submit without any Info for vehicles', async () => {
  await waitFor(() => doRender());
  expect(state.creatingListing).toBe(true);
  fireEvent.mouseDown(screen.getByRole('button', {name: 'Select Vehicle'}));
  fireEvent.click(
    await waitFor(() => (screen.getByRole('option', {name: 'Real Estate'}))));
  fireEvent.mouseDown(screen.getByRole('button', {name: 'Select Real Estate'}));
  fireEvent.click(
    await waitFor(() => (screen.getByRole('option', {name: 'Vehicle'}))));
  expect(screen.getByText('Photo URL', {selector: 'label'})).toBeDefined();
  expect(screen.getByText('Make')).toBeDefined();
  expect(screen.getByText('Color')).toBeDefined();
  expect(screen.getByText('Mileage')).toBeDefined();
  expect(screen.getByText('Price', {selector: 'label'})).toBeDefined();
  expect(screen.getByText('Description', {selector: 'label'})).toBeDefined();
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => expect(state.creatingListing).toBe(true));
});

test('Submit without any Info for real estate', async () => {
  await waitFor(() => doRender());
  expect(state.creatingListing).toBe(true);
  fireEvent.mouseDown(screen.getByText('Vehicle'));
  fireEvent.click(
    await waitFor(() => (screen.getByRole('option', {name: 'Real Estate'}))));
  expect(screen.getByText('Photo URL', {selector: 'label'})).toBeDefined();
  expect(screen.getByLabelText('Bedrooms')).toBeDefined();
  expect(screen.getByLabelText('Bathrooms')).toBeDefined();
  expect(screen.getByLabelText('Sq. Footage')).toBeDefined();
  expect(screen.getByLabelText('Pool')).toBeDefined();
  expect(screen.getByLabelText('Garage')).toBeDefined();
  expect(screen.getByText('Price', {selector: 'label'})).toBeDefined();
  expect(screen.getByText('Description', {selector: 'label'})).toBeDefined();
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => expect(state.creatingListing).toBe(true));
});

test('Submit with redacted info for vehicles', async () => {
  await waitFor(() => doRender());
  fireEvent.change(screen.getByLabelText('Photo URL', {selector: 'input'}),
    {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Make'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Color'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Mileage'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Price', {selector: 'input'}),
    {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Description', {selector: 'textarea'}),
    {target: {value: ''}});
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => expect(state.creatingListing).toBe(true));
});

test('Submit with some redacted for vehicles', async () => {
  await waitFor(() => doRender());
  fireEvent.change(screen.getByLabelText('Photo URL', {selector: 'input'}),
    {target: {value: 'https://media.wired.com/photos/5d09594a62bcb0c9752779d9/1:1/w_1500,h_1500,c_limit/Transpo_G70_TA-518126.jpg'}});
  fireEvent.change(screen.getByLabelText('Make'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Color'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Mileage'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Price', {selector: 'input'}),
    {target: {value: '32,000'}});
  fireEvent.change(screen.getByLabelText('Description', {selector: 'textarea'}),
    {target: {value: 'New'}});
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => expect(state.creatingListing).toBe(true));
});

test('Submit with some undefined content for vehicles', async () => {
  await waitFor(() => doRender());
  fireEvent.change(screen.getByLabelText('Photo URL', {selector: 'input'}),
    {target: {value: 'https://media.wired.com/photos/5d09594a62bcb0c9752779d9/1:1/w_1500,h_1500,c_limit/Transpo_G70_TA-518126.jpg'}});
  fireEvent.change(screen.getByLabelText('Price', {selector: 'input'}),
    {target: {value: '32,000'}});
  fireEvent.change(screen.getByLabelText('Description', {selector: 'textarea'}),
    {target: {value: 'New'}});
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => expect(state.creatingListing).toBe(true));
});

test('Submit with redacted info for real estate', async () => {
  await waitFor(() => doRender());
  expect(state.creatingListing).toBe(true);
  fireEvent.mouseDown(screen.getByText('Vehicle'));
  fireEvent.click(
    await waitFor(() => (screen.getByRole('option', {name: 'Real Estate'}))));
  fireEvent.change(screen.getByLabelText('Photo URL', {selector: 'input'}),
    {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Bedrooms'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Bathrooms'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Sq. Footage'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Pool'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Garage'), {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Price', {selector: 'input'}),
    {target: {value: ''}});
  fireEvent.change(screen.getByLabelText('Description', {selector: 'textarea'}),
    {target: {value: ''}});
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => expect(state.creatingListing).toBe(true));
});

test('Create valid listing for vehicles', async () => {
  await waitFor(() => doRender());
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
  await waitFor(() => expect(state.creatingListing).toBe(false));
});

/**
 * Tries to submit missing info and then filling in all info
 */
test('Create valid listing for real estate', async () => {
  await waitFor(() => doRender());
  expect(state.creatingListing).toBe(true);
  fireEvent.mouseDown(screen.getByText('Vehicle'));
  fireEvent.click(
    await waitFor(() => (screen.getByRole('option', {name: 'Real Estate'}))));
  fireEvent.change(screen.getByLabelText('Photo URL', {selector: 'input'}),
    {target: {value: 'https://media.wired.com/photos/5d09594a62bcb0c9752779d9/1:1/w_1500,h_1500,c_limit/Transpo_G70_TA-518126.jpg'}});
  fireEvent.change(screen.getByLabelText('Price', {selector: 'input'}),
    {target: {value: '100,000'}});
  fireEvent.change(screen.getByLabelText('Description', {selector: 'textarea'}),
    {target: {value: 'Hello'}});
  // Checks submit with missing info
  await waitFor(() => fireEvent.click(screen.getByText('Submit')));
  await waitFor(() => expect(state.creatingListing).toBe(true));
  fireEvent.change(screen.getByLabelText('Bedrooms',
    {selector: 'input'}), {target: {value: '1'}});
  fireEvent.change(screen.getByLabelText('Bathrooms',
    {selector: 'input'}), {target: {value: '1'}});
  fireEvent.change(screen.getByLabelText('Sq. Footage',
    {selector: 'input'}), {target: {value: '500'}});
  fireEvent.change(screen.getByLabelText('Pool',
    {selector: 'input'}), {target: {value: '1'}});
  fireEvent.change(screen.getByLabelText('Garage',
    {selector: 'input'}), {target: {value: '1'}});
  await waitFor(() => fireEvent.click(screen.getByText('Submit')));
  await waitFor(() => expect(state.creatingListing).toBe(false));
});

/**
 * Closes Create listing
 */
test('Closes create listing with button', async () => {
  await waitFor(() => doRender());
  expect(state.creatingListing).toBe(true);
  await waitFor(() => fireEvent
    .click(screen.getByTestId('CloseIcon')));
  await waitFor(() => expect(state.creatingListing).toBe(false));
});
