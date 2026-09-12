import { describe, it, expect } from 'vitest';
import { calculateOverallMatch } from '../../src/scoring/match.scorer.js';

describe('Match Scorer (Overall)', () => {
  const defaultCandidate = {
    skills: ['React', 'Node.js'],
    yearsOfExperience: 3,
    location: 'Gurugram',
    expectedSalary: 1000000, // 10 LPA
  };

  const defaultJob = {
    requiredSkills: [
      { name: 'React', type: 'must-have' },
      { name: 'Node.js', type: 'must-have' },
    ],
    minYearsExperience: 3,
    location: 'Gurugram',
    salaryRange: { min: 800000, max: 1200000 },
    remoteAllowed: false,
  };

  it('should return null (exclude job) if a must-have skill is missing', () => {
    const job = {
      ...defaultJob,
      requiredSkills: [
        { name: 'React', type: 'must-have' },
        { name: 'Node.js', type: 'must-have' },
        { name: 'TypeScript', type: 'must-have' }, // Missing in candidate
      ],
    };
    const result = calculateOverallMatch(defaultCandidate, job);
    expect(result).toBeNull();
  });

  it('should calculate overall score properly for perfect match', () => {
    const candidate = {
      skills: ['React', 'Node.js', 'Next.js'], // all needed + nice to have
      yearsOfExperience: 3,
      location: 'Gurugram',
      expectedSalary: 800000,
    };
    
    const job = {
      requiredSkills: [
        { name: 'React', type: 'must-have' },
        { name: 'Node.js', type: 'must-have' },
        { name: 'Next.js', type: 'nice-to-have' },
      ],
      minYearsExperience: 3,
      location: 'Gurugram',
      salaryRange: { min: 800000, max: 1200000 },
      remoteAllowed: false,
    };

    const result = calculateOverallMatch(candidate, job);
    
    // Skills (50) + Experience (20) + Location (15) + Salary (15) = 100
    expect(result.score).toBe(100);
    expect(result.breakdown.skills.score).toBe(50);
    expect(result.breakdown.experience.score).toBe(20);
    expect(result.breakdown.location.score).toBe(15);
    expect(result.breakdown.salary.score).toBe(15);
  });

  it('should format score to two decimal places', () => {
    const candidate = {
      skills: ['React', 'Node.js'],
      yearsOfExperience: 1, // 1 out of 3 = 6.67
      location: 'Bengaluru', // Remote allowed = 10
      expectedSalary: 1100000, // 15 * (12 - 11) / (12 - 8) = 15 * 1 / 4 = 3.75
    };

    const job = {
      requiredSkills: [
        { name: 'React', type: 'must-have' },
        { name: 'Node.js', type: 'must-have' },
        { name: 'Next.js', type: 'nice-to-have' }, // miss nice-to-have -> score 40
      ],
      minYearsExperience: 3,
      location: 'Gurugram',
      salaryRange: { min: 800000, max: 1200000 },
      remoteAllowed: true,
    };

    const result = calculateOverallMatch(candidate, job);

    // 40 + 6.67 + 10 + 3.75 = 60.42
    expect(result.score).toBe(60.42);
    expect(result.breakdown.skills.score).toBe(40);
    expect(result.breakdown.experience.score).toBe(6.67);
    expect(result.breakdown.location.score).toBe(10);
    expect(result.breakdown.salary.score).toBe(3.75);
  });
});
