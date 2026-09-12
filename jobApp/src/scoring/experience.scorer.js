import { DEFAULT_WEIGHTS } from './constants.js';

export const calculateExperienceScore = (candidateYears, jobMinYears, weight = DEFAULT_WEIGHTS.experience) => {
  if (jobMinYears === 0 || candidateYears >= jobMinYears) {
    return weight;
  }

  const ratio = candidateYears / jobMinYears;
  let score = ratio * weight;

  // Clamp between 0 and weight
  score = Math.max(0, Math.min(score, weight));

  return score;
};
