import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

import { 
  register, 
  login, 
  googleLogin, 
  getProfile, 
  updateProfile 
} from './controllers/auth.controller';
import { 
  createProject, 
  getProjects, 
  getProjectDetails, 
  updateProject, 
  deleteProject 
} from './controllers/project.controller';
import { 
  reviewCode, 
  fixBug, 
  generateReadme, 
  recommendProjectSetup, 
  handleAIChat, 
  getAIHistory, 
  deleteHistoryItem 
} from './controllers/ai.controller';
import { authenticateToken } from './middleware/auth.middleware';
import { UsersDB, ProjectsDB, UserStatisticsDB } from './db/db';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Seed Demo User and Projects if database is empty
const seedDatabase = async () => {
  const users = await UsersDB.find();
  if (users.length === 0) {
    console.log('Seeding initial developer demo database...');
    
    // Hash password 'password123'
    const SALT = 'devpilot_secure_salt_string';
    const passwordHash = crypto.pbkdf2Sync('password123', SALT, 1000, 64, 'sha512').toString('hex');
    
    const demoUser = await UsersDB.create({
      email: 'demo@devpilot.ai',
      passwordHash,
      name: 'Sarah Dev',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah'
    });

    // Create 3 demo projects
    await ProjectsDB.create({
      userId: demoUser.id,
      name: 'SaaS Billing Gateway',
      description: 'A microservice for managing Stripe billing webhooks, subscription cycles, and invoices.',
      category: 'Backend development',
      framework: 'Express.js',
      language: 'TypeScript',
      repoUrl: 'https://github.com/sarahdev/billing-gateway',
      status: 'Active'
    });

    await ProjectsDB.create({
      userId: demoUser.id,
      name: 'Developer Portfolio UI',
      description: 'Stunning glassmorphic developer portfolio showcasing open source achievements and blogs.',
      category: 'Frontend development',
      framework: 'Next.js 15',
      language: 'TypeScript',
      repoUrl: 'https://github.com/sarahdev/portfolio-next',
      status: 'Active'
    });

    await ProjectsDB.create({
      userId: demoUser.id,
      name: 'Eco-Tracker Mobile Client',
      description: 'Cross-platform mobile application helping individuals calculate daily carbon footprints.',
      category: 'Mobile development',
      framework: 'React Native',
      language: 'TypeScript',
      repoUrl: '',
      status: 'Planning'
    });

    // Set statistics
    await UserStatisticsDB.update(demoUser.id, {
      totalProjects: 3,
      aiRequests: 18,
      generatedDocs: 2,
      savedConversations: 1,
      weeklyActivity: [
        { week: 'Mon', requests: 2 },
        { week: 'Tue', requests: 4 },
        { week: 'Wed', requests: 3 },
        { week: 'Thu', requests: 1 },
        { week: 'Fri', requests: 5 },
        { week: 'Sat', requests: 2 },
        { week: 'Sun', requests: 1 }
      ]
    });

    console.log('Database seeded successfully. Demo login: demo@devpilot.ai / password123');
  }
};

// Establish MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devpilot';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🍃 Connected to MongoDB successfully');
    seedDatabase();
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// ---------------- API Routes ----------------

// Auth endpoints
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/google', googleLogin);
app.get('/api/auth/profile', authenticateToken, getProfile);
app.put('/api/auth/profile', authenticateToken, updateProfile);

// Project endpoints
app.post('/api/projects', authenticateToken, createProject);
app.get('/api/projects', authenticateToken, getProjects);
app.get('/api/projects/:id', getProjectDetails);
app.put('/api/projects/:id', authenticateToken, updateProject);
app.delete('/api/projects/:id', authenticateToken, deleteProject);

// AI Workspace endpoints
app.post('/api/ai/code-review', authenticateToken, reviewCode);
app.post('/api/ai/bug-fix', authenticateToken, fixBug);
app.post('/api/ai/readme', authenticateToken, generateReadme);
app.post('/api/ai/recommendation', authenticateToken, recommendProjectSetup);
app.post('/api/ai/chat', authenticateToken, handleAIChat);
app.get('/api/ai/history', authenticateToken, getAIHistory);
app.delete('/api/ai/history/:type/:id', authenticateToken, deleteHistoryItem);

// Simple Healthcheck API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 DevPilot-AI-v1.0 backend running at http://localhost:${PORT}`);
});
