import express from 'express';
import TestRoutes from './routes/TestRoutes.js';
import SolutionCoderRoutes from './routes/SolutionCoderRoutes.js';
import TestCoderRoutes from './routes/TestCoderRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/testharness', TestRoutes);
app.use('/api/solution', SolutionCoderRoutes);
app.use('/api/test', TestCoderRoutes);

export default app;
