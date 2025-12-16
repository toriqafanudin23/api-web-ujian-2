import { Router } from 'express';
import {
  getAllExams,
  getExamById,
  getExamByCode,
  createExam,
  updateExam,
  deleteExam,
} from '../controllers/examController.js';

const router = Router();

// GET /exams - Get all exams
router.get('/', getAllExams);

// GET /exams?code={code} - Get exam by code
router.get('/', getExamByCode); // This will handle query params

// GET /exams/:id - Get exam by ID
router.get('/:id', getExamById);

// POST /exams - Create a new exam
router.post('/', createExam);

// PUT /exams/:id - Update exam
router.put('/:id', updateExam);

// DELETE /exams/:id - Delete exam
router.delete('/:id', deleteExam);

export default router;