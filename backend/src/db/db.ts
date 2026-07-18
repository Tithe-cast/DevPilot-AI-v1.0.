import fs from 'fs';
import path from 'path';

// Define DB paths
const DB_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'db.json');

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

interface DatabaseSchema {
  users: User[];
  projects: Project[];
  aiChats: AIChat[];
  codeReviews: CodeReview[];
  bugReports: BugReport[];
  readmeDocuments: ReadmeDocument[];
  recommendations: Recommendation[];
  userStatistics: UserStatistics[];
}

const defaultDb: DatabaseSchema = {
  users: [],
  projects: [],
  aiChats: [],
  codeReviews: [],
  bugReports: [],
  readmeDocuments: [],
  recommendations: [],
  userStatistics: []
};

class LocalDatabase {
  private data: DatabaseSchema = defaultDb;

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      this.save();
    } else {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading database file, resetting to default', err);
        this.data = defaultDb;
        this.save();
      }
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save to database file', err);
    }
  }

  // Generic DB Collection Methods
  public getCollection<K extends keyof DatabaseSchema>(collectionName: K): DatabaseSchema[K] {
    return this.data[collectionName];
  }

  public saveCollection<K extends keyof DatabaseSchema>(collectionName: K, items: DatabaseSchema[K]) {
    this.data[collectionName] = items;
    this.save();
  }

  // Helper CRUD generators
  public createCRUD<T extends { id: string }, K extends keyof DatabaseSchema>(collectionName: K) {
    const db = this;
    return {
      find(filter?: Partial<T>): T[] {
        const items = db.getCollection(collectionName) as unknown as T[];
        if (!filter) return items;
        return items.filter((item) => {
          for (const key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
      },

      findOne(filter: Partial<T>): T | undefined {
        const items = db.getCollection(collectionName) as unknown as T[];
        return items.find((item) => {
          for (const key in filter) {
            if (item[key] !== filter[key]) return false;
          }
          return true;
        });
      },

      create(item: Omit<T, 'id' | 'createdAt'>): T {
        const items = db.getCollection(collectionName) as unknown as T[];
        const newItem = {
          ...item,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString()
        } as unknown as T;
        items.push(newItem);
        db.saveCollection(collectionName, items as unknown as DatabaseSchema[K]);
        return newItem;
      },

      update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): T | undefined {
        const items = db.getCollection(collectionName) as unknown as T[];
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return undefined;
        items[index] = { ...items[index], ...updates };
        db.saveCollection(collectionName, items as unknown as DatabaseSchema[K]);
        return items[index];
      },

      delete(id: string): boolean {
        const items = db.getCollection(collectionName) as unknown as T[];
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return false;
        items.splice(index, 1);
        db.saveCollection(collectionName, items as unknown as DatabaseSchema[K]);
        return true;
      }
    };
  }
}

export const db = new LocalDatabase();

// Expose collections CRUD
export const UsersDB = {
  find: (f?: Partial<User>) => db.createCRUD<User, 'users'>('users').find(f),
  findOne: (f: Partial<User>) => db.createCRUD<User, 'users'>('users').findOne(f),
  create: (item: Omit<User, 'id' | 'createdAt'>) => db.createCRUD<User, 'users'>('users').create(item),
  update: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => db.createCRUD<User, 'users'>('users').update(id, updates),
  delete: (id: string) => db.createCRUD<User, 'users'>('users').delete(id)
};

export const ProjectsDB = {
  find: (f?: Partial<Project>) => db.createCRUD<Project, 'projects'>('projects').find(f),
  findOne: (f: Partial<Project>) => db.createCRUD<Project, 'projects'>('projects').findOne(f),
  create: (item: Omit<Project, 'id' | 'createdAt'>) => db.createCRUD<Project, 'projects'>('projects').create(item),
  update: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => db.createCRUD<Project, 'projects'>('projects').update(id, updates),
  delete: (id: string) => db.createCRUD<Project, 'projects'>('projects').delete(id)
};

export const AIChatsDB = {
  find: (f?: Partial<AIChat>) => db.createCRUD<AIChat, 'aiChats'>('aiChats').find(f),
  findOne: (f: Partial<AIChat>) => db.createCRUD<AIChat, 'aiChats'>('aiChats').findOne(f),
  create: (item: Omit<AIChat, 'id' | 'createdAt'>) => db.createCRUD<AIChat, 'aiChats'>('aiChats').create(item),
  update: (id: string, updates: Partial<Omit<AIChat, 'id' | 'createdAt'>>) => db.createCRUD<AIChat, 'aiChats'>('aiChats').update(id, updates),
  delete: (id: string) => db.createCRUD<AIChat, 'aiChats'>('aiChats').delete(id)
};

export const CodeReviewsDB = {
  find: (f?: Partial<CodeReview>) => db.createCRUD<CodeReview, 'codeReviews'>('codeReviews').find(f),
  findOne: (f: Partial<CodeReview>) => db.createCRUD<CodeReview, 'codeReviews'>('codeReviews').findOne(f),
  create: (item: Omit<CodeReview, 'id' | 'createdAt'>) => db.createCRUD<CodeReview, 'codeReviews'>('codeReviews').create(item),
  delete: (id: string) => db.createCRUD<CodeReview, 'codeReviews'>('codeReviews').delete(id)
};

export const BugReportsDB = {
  find: (f?: Partial<BugReport>) => db.createCRUD<BugReport, 'bugReports'>('bugReports').find(f),
  findOne: (f: Partial<BugReport>) => db.createCRUD<BugReport, 'bugReports'>('bugReports').findOne(f),
  create: (item: Omit<BugReport, 'id' | 'createdAt'>) => db.createCRUD<BugReport, 'bugReports'>('bugReports').create(item),
  delete: (id: string) => db.createCRUD<BugReport, 'bugReports'>('bugReports').delete(id)
};

export const ReadmeDocumentsDB = {
  find: (f?: Partial<ReadmeDocument>) => db.createCRUD<ReadmeDocument, 'readmeDocuments'>('readmeDocuments').find(f),
  findOne: (f: Partial<ReadmeDocument>) => db.createCRUD<ReadmeDocument, 'readmeDocuments'>('readmeDocuments').findOne(f),
  create: (item: Omit<ReadmeDocument, 'id' | 'createdAt'>) => db.createCRUD<ReadmeDocument, 'readmeDocuments'>('readmeDocuments').create(item),
  delete: (id: string) => db.createCRUD<ReadmeDocument, 'readmeDocuments'>('readmeDocuments').delete(id)
};

export const RecommendationsDB = {
  find: (f?: Partial<Recommendation>) => db.createCRUD<Recommendation, 'recommendations'>('recommendations').find(f),
  findOne: (f: Partial<Recommendation>) => db.createCRUD<Recommendation, 'recommendations'>('recommendations').findOne(f),
  create: (item: Omit<Recommendation, 'id' | 'createdAt'>) => db.createCRUD<Recommendation, 'recommendations'>('recommendations').create(item),
  delete: (id: string) => db.createCRUD<Recommendation, 'recommendations'>('recommendations').delete(id)
};

// Specialized stats DB helpers
export const UserStatisticsDB = {
  findOne: (userId: string): UserStatistics => {
    const statsList = db.getCollection('userStatistics');
    let stats = statsList.find((s) => s.userId === userId);
    if (!stats) {
      stats = {
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
      };
      statsList.push(stats);
      db.saveCollection('userStatistics', statsList);
    }
    return stats;
  },

  update: (userId: string, updates: Partial<Omit<UserStatistics, 'userId'>>): UserStatistics => {
    const statsList = db.getCollection('userStatistics');
    const index = statsList.findIndex((s) => s.userId === userId);
    const current = UserStatisticsDB.findOne(userId);
    const updated = { ...current, ...updates };

    if (index === -1) {
      statsList.push(updated);
    } else {
      statsList[index] = updated;
    }

    db.saveCollection('userStatistics', statsList);
    return updated;
  },

  increment: (userId: string, field: 'totalProjects' | 'aiRequests' | 'generatedDocs' | 'savedConversations'): UserStatistics => {
    const current = UserStatisticsDB.findOne(userId);
    const updates = { [field]: current[field] + 1 };
    
    // Also increment today's weekly activity
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[new Date().getDay()];
    const updatedActivity = current.weeklyActivity.map(act => {
      if (act.week === currentDay) {
        return { ...act, requests: act.requests + (field === 'aiRequests' ? 1 : 0) };
      }
      return act;
    });

    return UserStatisticsDB.update(userId, { ...updates, weeklyActivity: updatedActivity });
  },

  decrement: (userId: string, field: 'totalProjects' | 'aiRequests' | 'generatedDocs' | 'savedConversations'): UserStatistics => {
    const current = UserStatisticsDB.findOne(userId);
    const updates = { [field]: Math.max(0, current[field] - 1) };
    return UserStatisticsDB.update(userId, updates);
  }
};
