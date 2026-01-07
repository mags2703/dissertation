import { Router } from 'express';
import { runTest } from '../controllers/TestController.js';

const router = Router();

router.get('/', runTest);

export default router;
