import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getQuestionsByExamId = async (req: Request, res: Response) => {
  try {
    const { examId } = req.query;
    if (!examId || typeof examId !== 'string') {
      return res.status(400).json({ error: 'examId query parameter is required' });
    }

    const questions = await prisma.question.findMany({
      where: { examId },
      include: {
        options: true,
      },
    });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { examId, type, text, points, imageUrl, correctAnswer, sampleAnswer, keywords, difficulty, tags, options } = req.body;

    // Validate required fields
    if (!examId || !type || !text || !points) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create question
    const question = await prisma.question.create({
      data: {
        examId,
        type,
        text,
        points: parseInt(points),
        imageUrl,
        correctAnswer,
        sampleAnswer,
        keywords: keywords || [],
        difficulty,
        tags: tags || [],
        options: {
          create: options?.map((opt: any) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })) || [],
        },
      },
      include: {
        options: true,
      },
    });

    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { examId, type, text, points, imageUrl, correctAnswer, sampleAnswer, keywords, difficulty, tags, options } = req.body;

    // Update question
    const question = await prisma.question.update({
      where: { id },
      data: {
        ...(examId && { examId }),
        ...(type && { type }),
        ...(text && { text }),
        ...(points && { points: parseInt(points) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(correctAnswer !== undefined && { correctAnswer }),
        ...(sampleAnswer !== undefined && { sampleAnswer }),
        ...(keywords && { keywords }),
        ...(difficulty && { difficulty }),
        ...(tags && { tags }),
        ...(options && {
          options: {
            deleteMany: {},
            create: options.map((opt: any) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        }),
      },
      include: {
        options: true,
      },
    });

    res.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.question.delete({
      where: { id },
    });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};