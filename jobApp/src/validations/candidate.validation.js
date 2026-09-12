import { z } from 'zod';

export const createCandidateSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')),
  yearsOfExperience: z.number().min(0, 'Years of experience cannot be negative'),
  location: z.string().min(1, 'Location cannot be empty'),
  expectedSalary: z.number().min(0, 'Expected salary cannot be negative'),
});
