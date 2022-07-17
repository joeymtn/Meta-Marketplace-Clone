import {screen} from '@testing-library/react';

/**
 * Source: From CSE 183 Assignment 5
 */

/**
 * @param {string} pattern
 * @return {element} clickable
 */
export function getClickable(pattern) {
  return screen.getByRole('button', {
    name: pattern,
  });
}
/**
 * @param {string} pattern
 * @param {number} count if udefined, find at least one
 * @return {element} if COUNT is 1 or undefined, undefined otherwise
 */
export function getManyVisible(pattern, count) {
  const elements = screen.queryAllByText(pattern);
  let visible = 0;
  let one = undefined;
  elements.map((element) => {
    try {
      expect(element).toBeVisible();
      visible++;
      one = one ? one : element;
    } catch { }
    return null;
  });
  expect(visible).toBe(count);
  // if (count !== undefined) {
  //   expect(visible).toBe(count);
  // } else {
  //   expect(visible >= 1).toBe(true);
  // }
  return count === 1 || count === undefined ? one : undefined;
}
/**
 * @param {string} pattern
 */
export function getNotVisible(pattern) {
  getManyVisible(pattern, 0);
}
/**
 * @param {string} pattern
 * @return {object} visible element
 */
export function getOnlyVisible(pattern) {
  return getManyVisible(pattern, 1);
}

// /**
//  * @param {string} pattern
//  * @return {object} first visible element
//  */
// export function getAnyVisible(pattern) {
//   return getManyVisible(pattern, undefined);
// }
// /**
//  * @param {number} width
//  */
// function setWidth(width) {
//   global.innerWidth = width;
//   act(() => {
//     global.dispatchEvent(new Event('resize'));
//   });
// }
// /** */
// export function setNarrow() {
//   setWidth(550);
// }
// /** */
// export function setWide() {
//   setWidth(750);
// }
