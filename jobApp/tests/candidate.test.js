import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Candidate } from '../src/models/candidate.model.js';

// Mock the Mongoose model
vi.mock('../src/models/candidate.model.js', () => {
  return {
    Candidate: vi.fn().mockImplementation((data) => ({
      ...data,
      save: vi.fn().mockResolvedValue(true),
      id: 'mock-id-123',
    }))
  };
});

describe('Candidate API', () => {
  it('should create a candidate successfully', async () => {
    const payload = {
      name: 'Isha Pal',
      skills: ['React', 'Node.js'],
      yearsOfExperience: 2,
      location: 'Gurugram',
      expectedSalary: 900000
    };

    const res = await request(app).post('/candidates').send(payload);
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(payload.name);
  });

  it('should fail validation when name is empty', async () => {
    const payload = {
      name: '',
      skills: ['React', 'Node.js'],
      yearsOfExperience: 2,
      location: 'Gurugram',
      expectedSalary: 900000
    };

    const res = await request(app).post('/candidates').send(payload);
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should fail validation when experience is negative', async () => {
    const payload = {
      name: 'Isha Pal',
      skills: ['React'],
      yearsOfExperience: -1,
      location: 'Gurugram',
      expectedSalary: 900000
    };

    const res = await request(app).post('/candidates').send(payload);
    expect(res.status).toBe(400);
  });
});
