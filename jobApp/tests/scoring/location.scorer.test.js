import { describe, it, expect } from 'vitest';
import { calculateLocationScore } from '../../src/scoring/location.scorer.js';

describe('Location Scorer', () => {
  it('should return 15 for exact match', () => {
    const score = calculateLocationScore('Gurugram', 'Gurugram', false);
    expect(score).toBe(15);
  });

  it('should return 15 for case-insensitive match', () => {
    const score = calculateLocationScore('gurugram', 'Gurugram', false);
    expect(score).toBe(15);
  });

  it('should return 10 for mismatch if remote is allowed', () => {
    const score = calculateLocationScore('Gurugram', 'Bengaluru', true);
    expect(score).toBe(10);
  });

  it('should return 0 for mismatch if remote is not allowed', () => {
    const score = calculateLocationScore('Gurugram', 'Bengaluru', false);
    expect(score).toBe(0);
  });
});
