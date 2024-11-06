import { expect, describe, test, beforeAll, afterAll } from 'vitest';
import getFiles from '../src/helpers/getFiles';
import fs from 'fs';

describe('getFiles', () => {
  // Generate test files before attmepting to read them using fs
  const testDir = './test/getFiles';
  beforeAll(() => {
    const files = ['index.ts', 'jpg0.jpg', 'webp0.webp', 'webp1.webp'];

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }

    files.forEach((file) => {
      fs.writeFileSync((testDir + "/" + file), '');
    });
  });

  test('should return only .ts files', () => {
    const tsFiles = getFiles(testDir, ['.ts']);
    expect(tsFiles).toHaveLength(1);
    expect(tsFiles).toContain('index.ts');
  });

  test('should return .jpg and .webp files', () => {
    const imageFiles = getFiles(testDir, ['.jpg', '.webp']);
    expect(imageFiles).toHaveLength(3);
    expect(imageFiles).toEqual(expect.arrayContaining(['jpg0.jpg', 'webp0.webp', 'webp1.webp']));
  });

  afterAll(() => {
    fs.rm(testDir, { recursive: true }, () => {});
  });
});