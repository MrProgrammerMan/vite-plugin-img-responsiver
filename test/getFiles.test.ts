import { expect, describe, test } from 'vitest';
import getFiles from '../src/helpers/getFiles';

describe('getFiles', () => {
  test('should return only .ts files', () => {
    const tsFiles = getFiles('test/assets', ['.ts']);
    expect(tsFiles).toHaveLength(1);
    expect(tsFiles).toContain('index.ts');
  });

  test('should return .jpg and .webp files', () => {
    const imageFiles = getFiles('test/assets', ['.jpg', '.webp']);
    expect(imageFiles).toHaveLength(3);
    expect(imageFiles).toEqual(expect.arrayContaining(['jpg0.jpg', 'webp0.webp', 'webp1.webp']));
  });
});