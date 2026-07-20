import mongoose, { Schema } from 'mongoose';

// Interface declarations
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  framework: string;
  language: string;
  repoUrl?: string;
  imageUrl?: string;
  status: 'Active' | 'Archived' | 'Planning';
  createdAt: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface AIChat {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface CodeReview {
  id: string;
  userId: string;
  language: string;
  sourceCode: string;
  review: {
    overview: string;
    bestPractices: string[];
    performance: string[];
    security: string[];
    refactoredCode: string;
  };
  createdAt: string;
}

export interface BugReport {
  id: string;
  userId: string;
  errorMessage: string;
  stackTrace: string;
  code?: string;
  analysis: {
    rootCause: string;
    explanation: string;
    suggestedSolution: string;
    preventionTips: string[];
  };
  createdAt: string;
}

export interface ReadmeDocument {
  id: string;
  userId: string;
  projectName: string;
  description: string;
  features: string;
  installation: string;
  techStack: string;
  content: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  projectId: string;
  recommendation: {
    folderStructure: string;
    packages: string[];
    authLibrary: string;
    database: string;
    deployment: string;
    architectureTips: string;
  };
  createdAt: string;
}

export interface UserStatistics {
  userId: string;
  totalProjects: number;
  aiRequests: number;
  generatedDocs: number;
  savedConversations: number;
  weeklyActivity: { week: string; requests: number }[];
}

// Mongoose Schemas
const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const ProjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  framework: { type: String, required: true },
  language: { type: String, required: true },
  repoUrl: { type: String },
  imageUrl: { type: String },
  status: { type: String, required: true, enum: ['Active', 'Archived', 'Planning'] },
  createdAt: { type: String, required: true }
});

const ChatMessageSchema = new Schema({
  sender: { type: String, required: true, enum: ['user', 'ai'] },
  content: { type: String, required: true },
  timestamp: { type: String, required: true }
});

const AIChatSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  projectId: { type: String },
  title: { type: String, required: true },
  messages: [ChatMessageSchema],
  createdAt: { type: String, required: true }
});

const CodeReviewSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  language: { type: String, required: true },
  sourceCode: { type: String, required: true },
  review: {
    overview: { type: String, required: true },
    bestPractices: [String],
    performance: [String],
    security: [String],
    refactoredCode: { type: String }
  },
  createdAt: { type: String, required: true }
});

const BugReportSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  errorMessage: { type: String, required: true },
  stackTrace: { type: String },
  code: { type: String },
  analysis: {
    rootCause: { type: String, required: true },
    explanation: { type: String, required: true },
    suggestedSolution: { type: String },
    preventionTips: [String]
  },
  createdAt: { type: String, required: true }
});

const ReadmeDocumentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: String },
  installation: { type: String },
  techStack: { type: String },
  content: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const RecommendationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  recommendation: {
    folderStructure: { type: String, required: true },
    packages: [String],
    authLibrary: { type: String, required: true },
    database: { type: String, required: true },
    deployment: { type: String, required: true },
    architectureTips: { type: String, required: true }
  },
  createdAt: { type: String, required: true }
});

const UserStatisticsSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  totalProjects: { type: Number, required: true, default: 0 },
  aiRequests: { type: Number, required: true, default: 0 },
  generatedDocs: { type: Number, required: true, default: 0 },
  savedConversations: { type: Number, required: true, default: 0 },
  weeklyActivity: [{
    week: { type: String, required: true },
    requests: { type: Number, required: true, default: 0 }
  }]
});

// Mongoose Models
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const AIChatModel = mongoose.models.AIChat || mongoose.model('AIChat', AIChatSchema);
export const CodeReviewModel = mongoose.models.CodeReview || mongoose.model('CodeReview', CodeReviewSchema);
export const BugReportModel = mongoose.models.BugReport || mongoose.model('BugReport', BugReportSchema);
export const ReadmeDocumentModel = mongoose.models.ReadmeDocument || mongoose.model('ReadmeDocument', ReadmeDocumentSchema);
export const RecommendationModel = mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema);
export const UserStatisticsModel = mongoose.models.UserStatistics || mongoose.model('UserStatistics', UserStatisticsSchema);

// CRUD helper wrappers
function createCRUDWrapper<T extends { id: string }, K>(Model: mongoose.Model<any>) {
  return {
    async find(filter?: Partial<T>): Promise<T[]> {
      return Model.find(filter || {}).lean() as unknown as Promise<T[]>;
    },

    async findOne(filter: Partial<T>): Promise<T | undefined> {
      const doc = await Model.findOne(filter).lean();
      return (doc || undefined) as unknown as Promise<T | undefined>;
    },

    async create(item: Omit<T, 'id' | 'createdAt'>): Promise<T> {
      const newItem = new Model({
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString()
      });
      await newItem.save();
      return newItem.toObject() as unknown as Promise<T>;
    },

    async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | undefined> {
      const doc = await Model.findOneAndUpdate({ id }, updates, { new: true }).lean();
      return (doc || undefined) as unknown as Promise<T | undefined>;
    },

    async delete(id: string): Promise<boolean> {
      const res = await Model.deleteOne({ id });
      return (res.deletedCount || 0) > 0;
    }
  };
}

// Expose collections CRUD
export const UsersDB = createCRUDWrapper<User, any>(UserModel);
export const ProjectsDB = createCRUDWrapper<Project, any>(ProjectModel);
export const AIChatsDB = createCRUDWrapper<AIChat, any>(AIChatModel);
export const CodeReviewsDB = createCRUDWrapper<CodeReview, any>(CodeReviewModel);
export const BugReportsDB = createCRUDWrapper<BugReport, any>(BugReportModel);
export const ReadmeDocumentsDB = createCRUDWrapper<ReadmeDocument, any>(ReadmeDocumentModel);
export const RecommendationsDB = createCRUDWrapper<Recommendation, any>(RecommendationModel);

// Specialized stats DB helper
export const UserStatisticsDB = {
  async findOne(userId: string): Promise<UserStatistics> {
    let stats = await UserStatisticsModel.findOne({ userId }).lean();
    if (!stats) {
      const newStats = new UserStatisticsModel({
        userId,
        totalProjects: 0,
        aiRequests: 0,
        generatedDocs: 0,
        savedConversations: 0,
        weeklyActivity: [
          { week: 'Mon', requests: 0 },
          { week: 'Tue', requests: 0 },
          { week: 'Wed', requests: 0 },
          { week: 'Thu', requests: 0 },
          { week: 'Fri', requests: 0 },
          { week: 'Sat', requests: 0 },
          { week: 'Sun', requests: 0 }
        ]
      });
      await newStats.save();
      stats = newStats.toObject();
    }
    return stats as unknown as UserStatistics;
  },

  async update(userId: string, updates: Partial<Omit<UserStatistics, 'userId'>>): Promise<UserStatistics> {
    // ensure initialization
    await UserStatisticsDB.findOne(userId);
    const updated = await UserStatisticsModel.findOneAndUpdate({ userId }, updates, { new: true }).lean();
    return updated as unknown as UserStatistics;
  },

  async increment(userId: string, field: 'totalProjects' | 'aiRequests' | 'generatedDocs' | 'savedConversations'): Promise<UserStatistics> {
    const current = await UserStatisticsDB.findOne(userId);
    const updates: any = { [field]: current[field] + 1 };
    
    if (field === 'aiRequests') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = days[new Date().getDay()];
      updates.weeklyActivity = current.weeklyActivity.map(act => {
        if (act.week === currentDay) {
          return { ...act, requests: act.requests + 1 };
        }
        return act;
      });
    }

    return UserStatisticsDB.update(userId, updates);
  },

  async decrement(userId: string, field: 'totalProjects' | 'aiRequests' | 'generatedDocs' | 'savedConversations'): Promise<UserStatistics> {
    const current = await UserStatisticsDB.findOne(userId);
    const updates = { [field]: Math.max(0, current[field] - 1) };
    return UserStatisticsDB.update(userId, updates);
  }
};
