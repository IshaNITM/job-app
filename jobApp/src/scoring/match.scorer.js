import { calculateSkillScore } from './skill.scorer.js';
import { calculateExperienceScore } from './experience.scorer.js';
import { calculateLocationScore } from './location.scorer.js';
import { calculateSalaryScore } from './salary.scorer.js';
import { DEFAULT_WEIGHTS } from './constants.js';

export const hasAllMustHaveSkills = (candidateSkills, jobRequiredSkills) => {
  const { missingMustHaveSkills } = calculateSkillScore(candidateSkills, jobRequiredSkills, DEFAULT_WEIGHTS.skills);
  return missingMustHaveSkills.length === 0;
};

export const calculateOverallMatch = (candidate, job, weights = DEFAULT_WEIGHTS) => {
  // 1. Must-have Hard Filter
  if (!hasAllMustHaveSkills(candidate.skills, job.requiredSkills)) {
    return null; // Job excluded
  }

  // 2. Skill Score
  const skillResult = calculateSkillScore(candidate.skills, job.requiredSkills, weights.skills);
  
  // 3. Experience Score
  const experienceScore = calculateExperienceScore(candidate.yearsOfExperience, job.minYearsExperience, weights.experience);
  
  // 4. Location Score
  const locationScore = calculateLocationScore(candidate.location, job.location, job.remoteAllowed, weights.location);
  
  // 5. Salary Score
  const salaryScore = calculateSalaryScore(candidate.expectedSalary, job.salaryRange.min, job.salaryRange.max, weights.salary);

  // Overall Score
  const overallScore = skillResult.score + experienceScore + locationScore + salaryScore;

  // Round consistently to two decimal places
  const roundedScore = Math.round(overallScore * 100) / 100;

  return {
    score: roundedScore,
    breakdown: {
      skills: {
        score: Math.round(skillResult.score * 100) / 100,
        max: weights.skills,
        ...skillResult, // Include matched/missing details
      },
      experience: {
        score: Math.round(experienceScore * 100) / 100,
        max: weights.experience,
      },
      location: {
        score: Math.round(locationScore * 100) / 100,
        max: weights.location,
      },
      salary: {
        score: Math.round(salaryScore * 100) / 100,
        max: weights.salary,
      }
    }
  };
};
