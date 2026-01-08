import { Router } from 'express';
import { promptModel } from '../controllers/SolutionCoderController.js';

const router = Router();

router.post('/', promptModel);

export default router;
