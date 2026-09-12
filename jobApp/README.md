# Job Match API

## Overview
The Job Match API is a backend-only Node.js/Express service backed by MongoDB that calculates and recommends the best-fit jobs for candidates based on a transparent, deterministic scoring algorithm. It evaluates candidates against jobs using four main criteria: Skills, Experience, Location, and Salary.

## Tech Stack
- **Node.js** (JavaScript)
- **Express.js** for routing
- **MongoDB** via **Mongoose** for data persistence
- **Zod** for schema validation
- **Vitest** for testing
- **Docker** for containerization

## Setup

### Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your database using **MongoDB Atlas** (Recommended):
   - Create a MongoDB Atlas cluster and add a database user.
   - Allow your local machine's IP in Atlas Network Access.
   - Copy the connection string.
   
   Alternatively, you can use a local MongoDB instance.

3. Set up environment variables. Copy `.env.example` to `.env`:
   ```bash
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/job_match_api?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   ```
   *(Note: Never put real credentials in `.env.example` or commit `.env` to version control!)*

4. Run the application in development mode:
   ```bash
   npm run dev
   ```

### Running Tests
Tests are written with Vitest and focus heavily on the scoring engine rules and API routes.
```bash
npm test
```

### Docker
To run the API and MongoDB using Docker Compose:
```bash
docker-compose up --build
```
This will expose the API on `http://localhost:5000`.

## API Documentation

### 1. Health Check
`GET /health`
```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

### 2. Create Candidate
`POST /candidates`
```json
// Request Body
{
  "name": "Isha Pal",
  "skills": ["React", "Node.js", "JavaScript"],
  "yearsOfExperience": 1.8,
  "location": "Gurugram",
  "expectedSalary": 900000
}
```

### 3. Create Job
`POST /jobs`
```json
// Request Body
{
  "title": "Frontend Developer",
  "requiredSkills": [
    { "name": "React", "type": "must-have" },
    { "name": "Next.js", "type": "nice-to-have" }
  ],
  "minYearsExperience": 2,
  "location": "Gurugram",
  "salaryRange": {
    "min": 800000,
    "max": 1200000
  },
  "remoteAllowed": true
}
```

### 4. Get Job Recommendations for Candidate
`GET /candidates/:candidateId/recommendations?limit=5`

Optionally pass `weights` as a JSON query parameter to override default weights.
```json
// Response
{
  "success": true,
  "data": {
    "candidateId": "66432...123",
    "recommendations": [
      {
        "jobId": "66432...456",
        "title": "Frontend Developer",
        "score": 85.33,
        "breakdown": {
          "skills": { "score": 45, "max": 50 },
          "experience": { "score": 13.33, "max": 20 },
          "location": { "score": 15, "max": 15 },
          "salary": { "score": 12, "max": 15 }
        }
      }
    ]
  }
}
```

### 5. Get Candidate Recommendations for Job (Reverse Match - Bonus)
`GET /jobs/:jobId/recommendations?limit=5`

---

## Scoring Model

The scoring engine is transparent, deterministic, and rule-based. Total maximum score is **100**.

### Weights
- **Skills**: 50 points
- **Experience**: 20 points
- **Location**: 15 points
- **Salary**: 15 points

### Skills (50 points)
Skills carry the highest weight as they are the primary indicator of technical fit.
- **Must-have skills**: 40 points. Missing ANY must-have skill completely excludes the job (score becomes 0/excluded).
- **Nice-to-have skills**: 10 points. These act as a boost. Missing a nice-to-have skill never excludes a candidate. If a job defines 0 nice-to-have skills, the nice-to-have score becomes 0, so the max possible score for that job is 40.

### Experience (20 points)
If a candidate does not meet the minimum years of experience, they are **not excluded**. Instead, they are penalized proportionally because candidates often learn quickly or underestimate their experience.
- Formula: `(candidateYears / requiredYears) * 20`
- Example: 1 year candidate for 3 year job = `(1 / 3) * 20 = 6.67` points.

### Location (15 points)
- Exact match: 15 points
- Different location, but remote allowed: 10 points
- Different location, remote not allowed: 0 points

### Salary (15 points)
- If job max salary is below candidate expectation: **0 points**
- If job minimum salary is at or above candidate expectation: **15 points** (full score)
- If candidate expectation falls inside the salary range: Proportional score based on how close it is to the job max.
- Formula: `15 * (job.max - candidate.expected) / (job.max - job.min)`
- *Edge case handled:* If a job specifies a fixed salary (min equals max) and the expectation is less than or equal to that fixed salary, it safely returns 15 points to prevent division by zero.

> **Note**: This scoring system is intentionally deterministic, transparent, and rule-based. It does not use Machine Learning, LLMs, or any "black-box" recommendation algorithms, ensuring complete explainability for why a job was matched or excluded.

### Overall Score Example
Candidate: 1 year exp, Gurugram, expects 11 LPA, knows React/Node.
Job: Needs React/Node (must), Next (nice). 3 years exp. Gurugram, remote allowed. 8-12 LPA.

- Skills: All must-have (40). Missing Next.js (0 nice-to-have) -> 40 points
- Experience: (1/3) * 20 -> 6.67 points
- Location: Exact match Gurugram -> 15 points
- Salary: 15 * (12 - 11) / (12 - 8) -> 3.75 points
- **Total**: 65.42 / 100

---

## Assumptions
- Skill matching is case-insensitive and ignores surrounding whitespace.
- Normalization ensures ` react ` matches `React`.
- Experience can be fractional (e.g. 1.5 years).
- Missing nice-to-have skills do not exclude jobs.
- Salary expectations are stored as numbers representing the same currency/unit across candidates and jobs.
- The `limit` query param defaults to 10 if not provided.

## AI Usage

AI tools were used as a development aid for brainstorming project structure,
implementation approaches, test cases, and documentation.

All generated suggestions were reviewed and adapted manually. The final
scoring rules, business-rule handling, validation, API behavior, and tests
were reviewed and edited to match the assignment requirements and the
chosen transparent scoring model.

## Future Improvements
- **Pagination**: Implement cursor-based pagination for large data sets instead of returning all loaded-in-memory jobs.
- **Database Indexing**: Add text indexes to skills and locations for faster MongoDB querying.
- **Caching**: Introduce Redis to cache job definitions or heavy queries.
- **OpenAPI/Swagger**: Generate Swagger documentation for the API routes.
