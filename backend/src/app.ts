import express from 'express';
import TestRoutes from './routes/TestRoutes.js';
import SolutionCoderRoutes from './routes/SolutionCoderRoutes.js';
import TestCoderRoutes from './routes/TestCoderRoutes.js';
import ProblemRoutes from './routes/ProblemRoutes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/testharness', TestRoutes);
app.use('/api/solution', SolutionCoderRoutes);
app.use('/api/test', TestCoderRoutes);
app.use('/api/problem', ProblemRoutes);

export default app;
