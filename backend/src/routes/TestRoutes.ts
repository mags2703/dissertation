import { Router } from 'express';
import { getMappings, runTest } from '../controllers/TestController.js';

const router = Router();

router.get('/', runTest);
router.get('/mappings', getMappings);

export default router;
