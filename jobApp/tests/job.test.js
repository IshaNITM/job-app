import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Job } from '../src/models/job.model.js';

// Mock the Mongoose model
vi.mock('../src/models/job.model.js', () => {
  return {
    Job: vi.fn().mockImplementation((data) => ({
      ...data,
      save: vi.fn().mockResolvedValue(true),
      id: 'mock-job-123',
    }))
  };
});

describe('Job API', () => {
  it('should create a job successfully', async () => {
    const payload = {
      title: 'Frontend Developer',
      requiredSkills: [
        { name: 'React', type: 'must-have' }
      ],
      minYearsExperience: 2,
      location: 'Gurugram',
      salaryRange: { min: 800000, max: 1200000 },
      remoteAllowed: false
    };

    const res = await request(app).post('/jobs').send(payload);
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(payload.title);
  });

  it('should fail validation when salary min > max', async () => {
    const payload = {
      title: 'Frontend Developer',
      requiredSkills: [
        { name: 'React', type: 'must-have' }
      ],
      minYearsExperience: 2,
      location: 'Gurugram',
      salaryRange: { min: 1200000, max: 800000 },
      remoteAllowed: false
    };

    const res = await request(app).post('/jobs').send(payload);
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
