import {render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import App from '../App';
import React from 'react';

const host = 'http://localhost:3010';
/**
 * mock global context provider
 * @param {*} props
 */

const vehicles =
  {
    'id': 'e91a7d62-ac38-4a9a-a32c-06b27c051cb0',
    'category': '1234',
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

const realEstate =
{
  'id': '1ca8a91d-a53d-49f7-90ac-0a001503bed4',
  'category': '5678',
  'content': {
    'price': '$10,123.11',
    'title': 'House 1',
    'created': '11/24/2021',
    'location': 'California',
    'username': 'sbyard4',
    'imageLink': 'http://dummyimage.com/156x100.png/5fa2dd/ffffff',
    'description': '4 Bedroom house with a huge bathtub',
  },
};

let jsonResponse;
const server = setupServer(
  rest.get(host + '/v0/listing', (req, res, ctx) => {
    const categoryId = req.url.searchParams.get('category');
    if (categoryId) {
      if (realEstate.category === categoryId) {
        jsonResponse = [realEstate];
      } else {
        jsonResponse = [vehicles];
      }
    } else {
      jsonResponse = [vehicles, realEstate];
    }
    return res(ctx.status(200), ctx.json(jsonResponse));
  }),
  rest.get(host + '/v0/category', (req, res, ctx) => {
    return res(ctx.status(200),
      ctx.json([{'name': 'Vehicle', 'id': '1234'},
        {'name': 'Real Estate', 'id': '5678'}]));
  }),
);

beforeAll(() => {
  server.listen();
  window.alert = jest.fn();
});

beforeEach(() => {
  render(
    <App/>,
  );
  // https://www.ryandoll.com/post/2018/3/29/jest-and-url-mocking
  window.history.pushState({}, '', '/');
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());
// https://polvara.me/posts/five-things-you-didnt-know-about-testing-library
test('Homepage has basic listings', async () => {
  await waitFor(() => screen.getByText('$10,123.11'));
  await waitFor(()=> screen.getByText('$4084.41'));
  await waitFor(() => screen.getByText('4 Bedroom house with a huge bathtub'));
  await waitFor(() => screen.getByText('Mitsubishi'));
  await waitFor(() => screen.getAllByText('California'));
});

test('Get listings after clicking Vehicles', async () => {
  await waitFor(() => screen.getByText('All Categories'));
  fireEvent.click(screen.getByText('All Categories'));
  await waitFor(() => screen.getByText('Vehicle'));
  // I don't think you need to await again when you click
  fireEvent.click(screen.getByText('Vehicle'));
  await waitFor(() => screen.getByText('Mitsubishi'));
  await waitFor(() => screen.getByText('California'));
  await waitFor(() => screen.getByText('$4084.41'));
});
test('Get Listings after clicking Real Estate', async () => {
  await waitFor(() => screen.getByText('All Categories'));
  fireEvent.click(screen.getByText('All Categories'));
  await waitFor(() => screen.getByText('Real Estate'));
  fireEvent.click(screen.getByText('Real Estate'));
  await waitFor(() => screen.getByText(realEstate.content.description));
  await waitFor(() => screen.getByText(realEstate.content.location));
  await waitFor(() => screen.getByText(realEstate.content.price));
});

test('Search for listings after clicking Real Estate', async () => {
  await waitFor(() => screen.getByText('All Categories'));
  fireEvent.click(screen.getByText('All Categories'));
  await waitFor(() => screen.getByText('Real Estate'));
  fireEvent.click(screen.getByText('Real Estate'));
  await waitFor(() => screen.getByLabelText('search'));
  await waitFor(() => fireEvent.change(screen.getByLabelText('search'),
    {target: {value: 'H'}}));
  await waitFor(() => fireEvent.change(screen.getByLabelText('search'),
    {target: {value: 'Hou'}}));
});
