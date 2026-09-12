import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Candidate } from '../src/models/candidate.model.js';
import { Job } from '../src/models/job.model.js';

vi.mock('../src/models/candidate.model.js');
vi.mock('../src/models/job.model.js');

describe('Recommendation API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return 400 for invalid candidate ID format', async () => {
    const res = await request(app).get('/candidates/invalid-id/recommendations');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_ID');
  });

  it('should return 404 if candidate not found', async () => {
    Candidate.findById.mockResolvedValue(null);
    const validId = '507f1f77bcf86cd799439011';
    
    const res = await request(app).get(`/candidates/${validId}/recommendations`);
    expect(res.status).toBe(404);
  });

  it('should return recommendations successfully and apply limit', async () => {
    const validId = '507f1f77bcf86cd799439011';
    
    const mockCandidate = {
      id: validId,
      skills: ['React', 'Node.js'],
      yearsOfExperience: 3,
      location: 'Gurugram',
      expectedSalary: 1000000,
    };

    const mockJobs = [
      {
        id: 'job1',
        title: 'Perfect Job',
        requiredSkills: [
          { name: 'React', type: 'must-have' },
          { name: 'Node.js', type: 'must-have' },
        ],
        minYearsExperience: 3,
        location: 'Gurugram',
        salaryRange: { min: 800000, max: 1200000 },
        remoteAllowed: false,
      },
      {
        id: 'job2',
        title: 'Mismatch Job',
        requiredSkills: [
          { name: 'Python', type: 'must-have' }, // Will be excluded
        ],
        minYearsExperience: 3,
        location: 'Gurugram',
        salaryRange: { min: 800000, max: 1200000 },
        remoteAllowed: false,
      },
    ];

    Candidate.findById.mockResolvedValue(mockCandidate);
    Job.find.mockResolvedValue(mockJobs);

    const res = await request(app).get(`/candidates/${validId}/recommendations?limit=1`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.recommendations).toHaveLength(1);
    expect(res.body.data.recommendations[0].title).toBe('Perfect Job');
    expect(res.body.data.recommendations[0].score).toBe(82.5);
  });
});
