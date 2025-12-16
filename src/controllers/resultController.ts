import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getResultsByExamId = async (req: Request, res: Response) => {
  try {
    const { examId } = req.query;
    if (!examId || typeof examId !== 'string') {
      return res.status(400).json({ error: 'examId query parameter is required' });
    }

    const results = await prisma.examResult.findMany({
      where: { examId },
      include: {
        answers: true,
      },
      orderBy: { submittedAt: 'desc' },
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getResultById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await prisma.examResult.findUnique({
      where: { id },
      include: {
        answers: true,
      },
    });
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createResult = async (req: Request, res: Response) => {
  try {
    const { examId, studentName, score, correctCount, totalQuestions, answers } = req.body;

    // Validate required fields
    if (!examId || !studentName || score === undefined || correctCount === undefined || totalQuestions === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create result
    const result = await prisma.examResult.create({
      data: {
        examId,
        studentName,
        score: parseFloat(score),
        correctCount: parseInt(correctCount),
        totalQuestions: parseInt(totalQuestions),
        answers: {
          create: answers?.map((ans: any) => ({
            questionId: ans.questionId,
            answer: ans.answer,
            manualGrade: ans.manualGrade,
            feedback: ans.feedback,
            gradingStatus: ans.gradingStatus,
          })) || [],
        },
      },
      include: {
        answers: true,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { manualGrades, score, gradingStatus } = req.body;

    // Update result
    const result = await prisma.examResult.update({
      where: { id },
      data: {
        ...(score !== undefined && { score: parseFloat(score) }),
        ...(gradingStatus && { gradingStatus }),
        ...(manualGrades && {
          answers: {
            updateMany: Object.entries(manualGrades).map(([questionId, grade]) => ({
              where: { questionId_resultId: { questionId, resultId: id } },
              data: { manualGrade: parseFloat(grade as string) },
            })),
          },
        }),
      },
      include: {
        answers: true,
      },
    });

    res.json(result);
  } catch (error) {
    console.error('Error updating result:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.examResult.delete({
      where: { id },
    });
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};