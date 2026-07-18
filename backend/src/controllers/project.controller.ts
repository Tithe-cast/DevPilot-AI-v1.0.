import { Response } from 'express';
import { ProjectsDB, UserStatisticsDB } from '../db/db';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createProject = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, description, category, framework, language, repoUrl, status } = req.body;

    if (!name || !description || !category || !framework || !language) {
      res.status(400).json({ error: 'Name, description, category, framework, and language are required' });
      return;
    }

    const newProject = ProjectsDB.create({
      userId,
      name,
      description,
      category,
      framework,
      language,
      repoUrl: repoUrl || '',
      status: status || 'Planning'
    });

    // Update user statistics
    UserStatisticsDB.increment(userId, 'totalProjects');

    res.status(201).json(newProject);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error creating project' });
  }
};

export const getProjects = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const projects = ProjectsDB.find({ userId });
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error retrieving projects' });
  }
};

export const getProjectDetails = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const project = ProjectsDB.findOne({ id, userId });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error retrieving project details' });
  }
};

export const updateProject = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { name, description, category, framework, language, repoUrl, status } = req.body;

    const project = ProjectsDB.findOne({ id, userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found or unauthorized' });
      return;
    }

    const updated = ProjectsDB.update(id, {
      name: name !== undefined ? name : project.name,
      description: description !== undefined ? description : project.description,
      category: category !== undefined ? category : project.category,
      framework: framework !== undefined ? framework : project.framework,
      language: language !== undefined ? language : project.language,
      repoUrl: repoUrl !== undefined ? repoUrl : project.repoUrl,
      status: status !== undefined ? status : project.status
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error updating project' });
  }
};

export const deleteProject = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const project = ProjectsDB.findOne({ id, userId });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    ProjectsDB.delete(id);

    // Update stats
    UserStatisticsDB.decrement(userId, 'totalProjects');

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error deleting project' });
  }
};
