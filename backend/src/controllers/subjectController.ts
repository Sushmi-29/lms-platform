import { Request, Response } from 'express';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  CreateSubjectData,
  UpdateSubjectData,
} from '../services/subjectService';

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await getAllSubjects();
    res.json({ data: subjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const subjectId = parseInt(id, 10);

  if (isNaN(subjectId)) {
    return res.status(400).json({ message: 'Invalid subject ID' });
  }

  try {
    const subject = await getSubjectById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Return subject directly (contents already included from service)
    res.json({ data: subject });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNewSubject = async (req: Request, res: Response) => {
  const { title, description, order_index } = req.body;

  if (!title || typeof order_index !== 'number') {
    return res.status(400).json({ message: 'Title and order_index are required' });
  }

  const data: CreateSubjectData = {
    title,
    description,
    order_index,
  };

  try {
    const subject = await createSubject(data);
    res.status(201).json({ data: subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateExistingSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const subjectId = parseInt(id, 10);

  if (isNaN(subjectId)) {
    return res.status(400).json({ message: 'Invalid subject ID' });
  }

  const { title, description, order_index } = req.body;

  const data: UpdateSubjectData = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (order_index !== undefined) data.order_index = order_index;

  try {
    const subject = await updateSubject(subjectId, data);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ data: subject });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteExistingSubject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const subjectId = parseInt(id, 10);

  if (isNaN(subjectId)) {
    return res.status(400).json({ message: 'Invalid subject ID' });
  }

  try {
    const deleted = await deleteSubject(subjectId);

    if (!deleted) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};