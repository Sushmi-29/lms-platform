import { Request, Response } from 'express';
import {
  getSectionsBySubjectId,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  CreateSectionData,
  UpdateSectionData,
} from '../services/sectionService';

export const getSections = async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const subjId = parseInt(subjectId, 10);

  if (isNaN(subjId)) {
    return res.status(400).json({ message: 'Invalid subject ID' });
  }

  try {
    const sections = await getSectionsBySubjectId(subjId);
    res.json({ data: sections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSingleSection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sectionId = parseInt(id, 10);

  if (isNaN(sectionId)) {
    return res.status(400).json({ message: 'Invalid section ID' });
  }

  try {
    const section = await getSectionById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json({ data: section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNewSection = async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const subjId = parseInt(subjectId, 10);

  if (isNaN(subjId)) {
    return res.status(400).json({ message: 'Invalid subject ID' });
  }

  const { title, order_index } = req.body;

  if (!title || typeof order_index !== 'number') {
    return res.status(400).json({ message: 'Title and order_index are required' });
  }

  const data: CreateSectionData = {
    title,
    order_index,
  };

  try {
    const section = await createSection(subjId, data);
    res.status(201).json({ data: section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateExistingSection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sectionId = parseInt(id, 10);

  if (isNaN(sectionId)) {
    return res.status(400).json({ message: 'Invalid section ID' });
  }

  const { title, order_index } = req.body;

  const data: UpdateSectionData = {};
  if (title !== undefined) data.title = title;
  if (order_index !== undefined) data.order_index = order_index;

  try {
    const section = await updateSection(sectionId, data);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json({ data: section });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteExistingSection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const sectionId = parseInt(id, 10);

  if (isNaN(sectionId)) {
    return res.status(400).json({ message: 'Invalid section ID' });
  }

  try {
    const deleted = await deleteSection(sectionId);
    if (!deleted) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};