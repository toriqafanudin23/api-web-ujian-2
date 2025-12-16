import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAllExams = async (req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exam = await prisma.exam.findUnique({
      where: { id },
    });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExamByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code query parameter is required' });
    }
    const exams = await prisma.exam.findMany({
      where: { code },
    });
    res.json(exams);
  } catch (error) {
    console.error('Error fetching exam by code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createExam = async (req: Request, res: Response) => {
  try {
    const { title, description, code, duration, startTime, endTime, isActive } = req.body;

    // Validate required fields
    if (!title || !description || !code || !duration || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the exam
    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        code,
        duration: parseInt(duration),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isActive: isActive ?? false,
      },
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ error: 'Exam code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, code, duration, startTime, endTime, isActive } = req.body;

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(code && { code }),
        ...(duration && { duration: parseInt(duration) }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json(exam);
  } catch (error) {
    console.error('Error updating exam:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Exam not found' });
    }
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ error: 'Exam code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.exam.delete({
      where: { id },
    });
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};