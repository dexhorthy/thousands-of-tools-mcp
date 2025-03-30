import { add } from "./utils.js";

describe('Basic math functions', () => {
  test('add function adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
    expect(add(0, 0)).toBe(0);
  });
});
