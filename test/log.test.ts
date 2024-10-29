// log.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import log from '../src/helpers/log';

describe('log function', () => {
  beforeEach(() => {
    // Mock console.log before each test
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.log to its original state after each test
    vi.restoreAllMocks();
  });

  it('should log the message to the console', () => {
    const message = 'Hello, world!';
    
    // Call the log function
    log(message);
    
    // Verify that console.log was called with the correct message
    expect(console.log).toHaveBeenCalledWith(message);
  });
});
