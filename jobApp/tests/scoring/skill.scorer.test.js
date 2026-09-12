import { describe, it, expect } from 'vitest';
import { calculateSkillScore } from '../../src/scoring/skill.scorer.js';

describe('Skill Scorer', () => {
  it('should return 40 points if all must-have skills match and no nice-to-have required', () => {
    const candidateSkills = ['React', 'Node.js'];
    const jobSkills = [
      { name: 'React', type: 'must-have' },
      { name: 'Node.js', type: 'must-have' },
    ];
    const result = calculateSkillScore(candidateSkills, jobSkills);
    expect(result.score).toBe(40);
    expect(result.missingMustHaveSkills.length).toBe(0);
  });

  it('should return 50 points if all must-have and nice-to-have skills match', () => {
    const candidateSkills = ['React', 'Node.js', 'Next.js'];
    const jobSkills = [
      { name: 'React', type: 'must-have' },
      { name: 'Node.js', type: 'must-have' },
      { name: 'Next.js', type: 'nice-to-have' },
    ];
    const result = calculateSkillScore(candidateSkills, jobSkills);
    expect(result.score).toBe(50);
  });

  it('should calculate nice-to-have proportionally', () => {
    const candidateSkills = ['React', 'Node.js', 'Docker'];
    const jobSkills = [
      { name: 'React', type: 'must-have' },
      { name: 'Node.js', type: 'must-have' },
      { name: 'Next.js', type: 'nice-to-have' },
      { name: 'Docker', type: 'nice-to-have' },
    ];
    const result = calculateSkillScore(candidateSkills, jobSkills);
    // 40 for must-have, 5 for nice-to-have (1 out of 2) -> 45
    expect(result.score).toBe(45);
    expect(result.matchedNiceToHaveSkills).toContain('Docker');
    expect(result.missingNiceToHaveSkills).toContain('Next.js');
  });

  it('should handle missing nice-to-have safely', () => {
    const candidateSkills = ['React', 'Node.js'];
    const jobSkills = [
      { name: 'React', type: 'must-have' },
      { name: 'Node.js', type: 'must-have' },
      { name: 'Next.js', type: 'nice-to-have' },
    ];
    const result = calculateSkillScore(candidateSkills, jobSkills);
    expect(result.score).toBe(40);
  });

  it('should handle case-insensitivity and whitespace', () => {
    const candidateSkills = [' react ', 'NODE.js'];
    const jobSkills = [
      { name: 'React', type: 'must-have' },
      { name: 'node.js', type: 'must-have' },
    ];
    const result = calculateSkillScore(candidateSkills, jobSkills);
    expect(result.score).toBe(40);
  });
});
