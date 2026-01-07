import express from 'express';
import TestRoutes from './routes/TestRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/testing', TestRoutes);

export default app;
