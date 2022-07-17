const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();
const app = require('../../backend/src/app');

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3010, () => {
    console.log('Backend Running at http://localhost:3010');
  });
  frontend = http.createServer(
    express()
      .use('/v0', createProxyMiddleware({ 
        target: 'http://localhost:3010/',
        changeOrigin: true}))
      .use('/static', express.static(
        path.join(__dirname, '..', '..', 'frontend', 'build', 'static')))
      .get('*', function(req, res) {
        res.sendFile('index.html', 
            {root:  path.join(__dirname, '..', '..', 'frontend', 'build')})
      })
  );
  frontend.listen(3000, () => {
    console.log('Frontend Running at http://localhost:3000');
  });
});

afterAll((done) => {
  backend.close(() => { 
    frontend.close(done);
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless',
    ],
  });
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

// Clicks the 'Get Dummy' button and checks the server response is displayed.
// test('Get Dummy', async () => {
//   await page.goto('http://localhost:3000');
//   const label = await page.$('aria/dummy message');
//   let cont = await (await label.getProperty('textContent')).jsonValue();
//   expect(cont).toBe('Click the button!');
//   await page.click('aria/get dummy[role="button"]');
//   await page.waitForFunction(
//     'document.querySelector("label").innerText.includes("Hello CSE183")',
//   );
//   cont = await (await label.getProperty('textContent')).jsonValue();
//   expect(cont.search(/Hello CSE183/)).toEqual(0);
//   expect(cont.search(/Database created/)).toBeGreaterThan(60);
// });

test('Check for correct components on the home page', async () => {
  await page.goto('http://localhost:3000');
  const label = await page.$$('header div.MuiTypography-root');
  expect(label.length).toBe(1);
  expect(await (await label[0].getProperty('textContent')).jsonValue()).toBe('facebook');
  const buttons = await page.$$('button');
  expect(buttons.length).toBe(6);
  expect(await (await buttons[0].getProperty('textContent')).jsonValue()).toBe('Log In');
  expect(await (await buttons[1].getProperty('textContent')).jsonValue()).toBe('Log In');
  expect(await (await buttons[2].getProperty('textContent')).jsonValue()).toBe('Learn more');
  expect(await (await buttons[3].getProperty('textContent')).jsonValue()).toBe('Create New Listing');
  expect(await (await buttons[4].getProperty('textContent')).jsonValue()).toBe('Filters');
  const chips = await page.$$('span.MuiChip-label');
  expect(chips.length).toBe(2);
  expect(await (await chips[0].getProperty('textContent')).jsonValue()).toBe('Sell');
  expect(await (await chips[1].getProperty('textContent')).jsonValue()).toBe('All Categories');
});


test('Check that All Categories generates drawers', async () => {
  await page.goto('http://localhost:3000');
  await page.click("[aria-label='button__allCategories']");
  const vehicle = await page.$('*[aria-label="categoryDrawer-0"]');
  const realEstate = await page.$('*[aria-label="categoryDrawer-1"]');
  expect(await (await vehicle.getProperty('textContent')).jsonValue()).toBe('Vehicle');
  expect(await (await realEstate.getProperty('textContent')).jsonValue()).toBe('Real Estate');
});

test('Check that clicking vehicles creates listings', async () => {
  await page.goto('http://localhost:3000');
  await page.click("[aria-label='button__allCategories']");
  await page.click('[aria-label="categoryDrawer-0"]');
  const images = await page.$$('img');
  expect(images.length).toBe(3);
  const breadcrumbs = await page.$$('.MuiBreadcrumbs-li');
  expect(breadcrumbs.length).toBe(2)
  expect(await (await breadcrumbs[0].getProperty('textContent')).jsonValue()).toBe('Marketplace');
  expect(await (await breadcrumbs[1].getProperty('textContent')).jsonValue()).toBe('Vehicle');
  const chips = await page.$$('span.MuiChip-label');
  expect(chips.length).toBe(2)
  expect(await (await chips[0].getProperty('textContent')).jsonValue()).toBe('Motorcycle');
  expect(await (await chips[1].getProperty('textContent')).jsonValue()).toBe('Car');
});

test('Check that clicking Real Estate creates listings', async () => {
  await page.goto('http://localhost:3000');
  await page.click("[aria-label='button__allCategories']");
  await page.click('[aria-label="categoryDrawer-1"]');
  const images = await page.$$('img');
  expect(images.length).toBe(6);
  const breadcrumbs = await page.$$('.MuiBreadcrumbs-li');
  expect(breadcrumbs.length).toBe(2)
  expect(await (await breadcrumbs[0].getProperty('textContent')).jsonValue()).toBe('Marketplace');
  expect(await (await breadcrumbs[1].getProperty('textContent')).jsonValue()).toBe('Real Estate');
  const chips = await page.$$('span.MuiChip-label');
  expect(chips.length).toBe(2)
  expect(await (await chips[0].getProperty('textContent')).jsonValue()).toBe('House');
  expect(await (await chips[1].getProperty('textContent')).jsonValue()).toBe('Apartment');
});


test('Check that v', async () => {
  await page.goto('http://localhost:3000');
  await page.click("[aria-label='button__allCategories']");
  await page.click('[aria-label="categoryDrawer-0"]');
  const images = await page.$$('img');
  expect(images.length).toBe(3);
  const breadcrumbs = await page.$$('.MuiBreadcrumbs-li');
  expect(breadcrumbs.length).toBe(2)
  expect(await (await breadcrumbs[0].getProperty('textContent')).jsonValue()).toBe('Marketplace');
  expect(await (await breadcrumbs[1].getProperty('textContent')).jsonValue()).toBe('Vehicle');
  const chips = await page.$$('span.MuiChip-label');
  expect(chips.length).toBe(2)
  expect(await (await chips[0].getProperty('textContent')).jsonValue()).toBe('Motorcycle');
  expect(await (await chips[1].getProperty('textContent')).jsonValue()).toBe('Car');
});

test('Check that clicking Real Estate creates listings', async () => {
  await page.goto('http://localhost:3000');
  await page.click("[aria-label='button__allCategories']");
  await page.click('[aria-label="categoryDrawer-1"]');
  const images = await page.$$('img');
  expect(images.length).toBe(6);
  const breadcrumbs = await page.$$('.MuiBreadcrumbs-li');
  expect(breadcrumbs.length).toBe(2)
  expect(await (await breadcrumbs[0].getProperty('textContent')).jsonValue()).toBe('Marketplace');
  expect(await (await breadcrumbs[1].getProperty('textContent')).jsonValue()).toBe('Real Estate');
  const chips = await page.$$('span.MuiChip-label');
  expect(chips.length).toBe(2)
  expect(await (await chips[0].getProperty('textContent')).jsonValue()).toBe('House');
  expect(await (await chips[1].getProperty('textContent')).jsonValue()).toBe('Apartment');
});


