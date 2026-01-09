import { Router } from 'express';
import { promptModel } from '../controllers/TestCoderController.js';

const router = Router();

router.post('/', promptModel);

export default router;
