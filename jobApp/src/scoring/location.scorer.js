import { normalizeStr } from '../utils/normalize.js';
import { DEFAULT_WEIGHTS } from './constants.js';

export const calculateLocationScore = (candidateLocation, jobLocation, remoteAllowed, weight = DEFAULT_WEIGHTS.location) => {
  const normCandidateLoc = normalizeStr(candidateLocation);
  const normJobLoc = normalizeStr(jobLocation);

  if (normCandidateLoc === normJobLoc) {
    return weight; // 15
  }

  if (remoteAllowed) {
    return weight * (10 / 15); // 10
  }

  return 0; // 0
};
