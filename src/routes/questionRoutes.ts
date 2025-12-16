import { Router } from 'express';
import {
  getQuestionsByExamId,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController.js';

const router = Router();

// GET /questions?examId={examId} - Get questions by exam ID
router.get('/', getQuestionsByExamId);

// GET /questions/:id - Get question by ID
router.get('/:id', getQuestionById);

// POST /questions - Create a new question
router.post('/', createQuestion);

// PUT /questions/:id - Update question
router.put('/:id', updateQuestion);

// DELETE /questions/:id - Delete question
router.delete('/:id', deleteQuestion);

export default router;