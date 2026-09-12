import { Candidate } from '../models/candidate.model.js';

export const createCandidate = async (candidateData) => {
  const candidate = new Candidate(candidateData);
  await candidate.save();
  return candidate;
};
