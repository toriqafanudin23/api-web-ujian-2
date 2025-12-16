import { Router } from 'express';
import {
  getResultsByExamId,
  getResultById,
  createResult,
  updateResult,
  deleteResult,
} from '../controllers/resultController.js';

const router = Router();

// GET /results?examId={examId} - Get results by exam ID
router.get('/', getResultsByExamId);

// GET /results/:id - Get result by ID
router.get('/:id', getResultById);

// POST /results - Create a new result
router.post('/', createResult);

// PATCH /results/:id - Update result (for manual grading)
router.patch('/:id', updateResult);

// DELETE /results/:id - Delete result
router.delete('/:id', deleteResult);

export default router;