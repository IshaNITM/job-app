import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name cannot be empty'),
  type: z.enum(['must-have', 'nice-to-have']),
});

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  requiredSkills: z.array(skillSchema),
  minYearsExperience: z.number().min(0, 'Minimum years of experience cannot be negative'),
  location: z.string().min(1, 'Location cannot be empty'),
  salaryRange: z.object({
    min: z.number().min(0, 'Salary min cannot be negative'),
    max: z.number().min(0, 'Salary max cannot be negative'),
  }).refine(data => data.min <= data.max, {
    message: "Salary minimum cannot exceed salary maximum",
    path: ["min"], // path of error
  }),
  remoteAllowed: z.boolean(),
});
