import { normalizeStr } from '../utils/normalize.js';
import { DEFAULT_WEIGHTS } from './constants.js';

export const calculateSkillScore = (candidateSkills, jobRequiredSkills, weight = DEFAULT_WEIGHTS.skills) => {
  const normalizedCandidateSkills = new Set(candidateSkills.map(normalizeStr));
  
  const mustHaveSkills = jobRequiredSkills.filter(s => s.type === 'must-have');
  const niceToHaveSkills = jobRequiredSkills.filter(s => s.type === 'nice-to-have');

  const matchedMustHaveSkills = [];
  const missingMustHaveSkills = [];
  const matchedNiceToHaveSkills = [];
  const missingNiceToHaveSkills = [];

  // Evaluate Must-Have (Hard Filter checked later, but we calculate score here)
  mustHaveSkills.forEach(skill => {
    const norm = normalizeStr(skill.name);
    if (normalizedCandidateSkills.has(norm)) {
      matchedMustHaveSkills.push(skill.name); // Using original name for reporting
    } else {
      missingMustHaveSkills.push(skill.name);
    }
  });

  // Evaluate Nice-To-Have
  niceToHaveSkills.forEach(skill => {
    const norm = normalizeStr(skill.name);
    if (normalizedCandidateSkills.has(norm)) {
      matchedNiceToHaveSkills.push(skill.name);
    } else {
      missingNiceToHaveSkills.push(skill.name);
    }
  });

  // Score breakdown
  // Must-have = 40 points, Nice-to-have = 10 points
  const maxMustHaveScore = weight * 0.8; // 40
  const maxNiceToHaveScore = weight * 0.2; // 10

  const mustHaveScore = mustHaveSkills.length === 0 
    ? maxMustHaveScore 
    : (matchedMustHaveSkills.length / mustHaveSkills.length) * maxMustHaveScore;



  let calculatedNiceToHaveScore = 0;
  if (niceToHaveSkills.length > 0) {
    calculatedNiceToHaveScore = (matchedNiceToHaveSkills.length / niceToHaveSkills.length) * maxNiceToHaveScore;
  }

  const totalScore = mustHaveScore + calculatedNiceToHaveScore;

  return {
    score: totalScore,
    matchedMustHaveSkills,
    missingMustHaveSkills,
    matchedNiceToHaveSkills,
    missingNiceToHaveSkills,
  };
};
