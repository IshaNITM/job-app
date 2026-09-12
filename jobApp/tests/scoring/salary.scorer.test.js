import { describe, it, expect } from 'vitest';
import { calculateSalaryScore } from '../../src/scoring/salary.scorer.js';

describe('Salary Scorer', () => {
  it('should return 0 if candidate expected > job max', () => {
    // Expected 15, Job max 12
    const score = calculateSalaryScore(15, 8, 12);
    expect(score).toBe(0);
  });

  it('should return 15 if candidate expected <= job min', () => {
    // Expected 7, Job min 8
    const score = calculateSalaryScore(7, 8, 12);
    expect(score).toBe(15);
  });

  it('should calculate proportional score if expected is inside range', () => {
    // Expected 10, Range 8-12
    // 15 * (12 - 10) / (12 - 8) = 15 * 2 / 4 = 7.5
    const score = calculateSalaryScore(10, 8, 12);
    expect(score).toBe(7.5);
  });

  it('should handle min == max safely', () => {
    // Expected 10, Range 10-10
    // Based on implementation, jobMin >= candidate expected triggers case 2 (score = 15)
    const score = calculateSalaryScore(10, 10, 10);
    expect(score).toBe(15);
  });
});
