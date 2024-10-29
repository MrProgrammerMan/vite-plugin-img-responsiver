import { expect, test } from 'vitest'
import { getFiles } from '../src/helpers/build-tools'

test('getFiles', () => {
  expect(getFiles('test/assets', ['.ts'])).toContain('index.ts');
  const files = getFiles('test/assets', [".jpg", ".webp"]);
  expect(files).toHaveLength(3);
  expect(files).toContain("jpg0.jpg");
  expect(files).toContain("webp0.webp");
  expect(files).toContain("webp1.webp");
})