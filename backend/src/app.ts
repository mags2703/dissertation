import express from 'express';
import TestRoutes from './routes/TestRoutes.js';
import SolutionCoderRoutes from './routes/SolutionCoderRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/testing', TestRoutes);
app.use('/api/solution', SolutionCoderRoutes);

export default app;
