import { Router } from 'express';
import {
  changeActiveProblem,
  getActiveProblem,
  getProblems,
} from '../controllers/ProblemController.js';

const router = Router();

router.get('/', getProblems);
router.get('/active', getActiveProblem);
router.post('/active', changeActiveProblem);
export default router;
