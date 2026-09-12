import { describe, it, expect } from 'vitest';
import { calculateExperienceScore } from '../../src/scoring/experience.scorer.js';

describe('Experience Scorer', () => {
  it('should return 20 if candidate has exact experience', () => {
    const score = calculateExperienceScore(3, 3);
    expect(score).toBe(20);
  });

  it('should return 20 if candidate has more experience', () => {
    const score = calculateExperienceScore(5, 3);
    expect(score).toBe(20);
  });

  it('should apply proportional penalty for lower experience', () => {
    // 1 year out of 3 required -> 1/3 * 20 = 6.666...
    const score = calculateExperienceScore(1, 3);
    expect(score).toBeCloseTo(6.67, 1);
  });

  it('should handle zero required experience safely and return full score', () => {
    const score = calculateExperienceScore(0, 0);
    expect(score).toBe(20);
  });

  it('should handle zero candidate experience proportionally', () => {
    const score = calculateExperienceScore(0, 3);
    expect(score).toBe(0);
  });
});
