import { DEFAULT_WEIGHTS } from './constants.js';

export const calculateSalaryScore = (candidateExpected, jobMin, jobMax, weight = DEFAULT_WEIGHTS.salary) => {
  if (jobMax < candidateExpected) {
    return 0; // Case 1
  }

  if (jobMin >= candidateExpected) {
    return weight; // Case 2
  }

  // Case 3: candidate expectation is inside the job salary range
  if (jobMin === jobMax) {
    // If min === max, and max >= candidate (checked above) and min < candidate (checked above) 
    // Wait, if min === max, how can jobMin < candidate and jobMax >= candidate?
    // It's not possible unless jobMin < candidate <= jobMin which means it must be exactly jobMin, but that would fall into Case 2.
    // So this line technically should never be reached in a logical flow if min === max, 
    // but just to be safe to prevent division by zero:
    return weight;
  }

  const score = weight * ((jobMax - candidateExpected) / (jobMax - jobMin));
  
  return Math.max(0, Math.min(score, weight));
};
