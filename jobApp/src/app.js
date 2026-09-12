import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import candidateRoutes from './routes/candidate.routes.js';
import jobRoutes from './routes/job.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/candidates', candidateRoutes);
app.use('/jobs', jobRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok'
    }
  });
});

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
