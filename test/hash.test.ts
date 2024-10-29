import { describe, expect, test } from 'vitest';
import hash from '../src/helpers/hash';

describe('hash', () => {
  test('should return a consistent 32-bit integer for a given string', () => {
    const str = 'Foo bar baz';
    const result = hash(str);

    expect(result).toBeTypeOf('number');
    expect(result).toBe(hash(str)); // Consistency check
  });

  test('should produce different hash codes for different strings', () => {
    const str1 = 'Foo bar baz';
    const str2 = 'Baz bar foo';

    const hash1 = hash(str1);
    const hash2 = hash(str2);

    expect(hash1).not.toBe(hash2);
  });

  test('should handle empty string input', () => {
    const result = hash('');
    expect(result).toBe(0);
  });

  test('should return the correct hash for known values', () => {
    const knownString = 'test';
    const expectedHash = 3556498; // Precomputed hash for the string "test"
    
    const result = hash(knownString);
    expect(result).toBe(expectedHash);
  });
});