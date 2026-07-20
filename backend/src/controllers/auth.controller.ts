import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UsersDB, UserStatisticsDB } from '../db/db';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'devpilot_jwt_secret_key_123456789';
const SALT = 'devpilot_secure_salt_string';

const hashPassword = (password: string): string => {
  return crypto.pbkdf2Sync(password, SALT, 1000, 64, 'sha512').toString('hex');
};

export const register = (req: Request, res: Response): void => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const existingUser = UsersDB.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = hashPassword(password);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

    const newUser = UsersDB.create({
      email,
      passwordHash,
      name,
      avatarUrl
    });

    // Initialize statistics
    UserStatisticsDB.findOne(newUser.id);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatarUrl: newUser.avatarUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error during registration' });
  }
};

export const login = (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = UsersDB.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const hash = hashPassword(password);
    if (user.passwordHash !== hash) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error during login' });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    let { email, name, avatarUrl, token } = req.body;

    if (token) {
      // Fetch verified user profile directly from Google UserInfo API
      const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!googleResponse.ok) {
        res.status(400).json({ error: 'Failed to verify Google access token' });
        return;
      }

      const googleUser: any = await googleResponse.json();
      email = googleUser.email;
      name = googleUser.name;
      avatarUrl = googleUser.picture;
    }

    if (!email || !name) {
      res.status(400).json({ error: 'Email and name are required' });
      return;
    }

    let user = UsersDB.findOne({ email });

    if (!user) {
      // Create user with dummy password hash for social login
      const dummyPassword = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(dummyPassword);
      const defaultAvatar = avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

      user = UsersDB.create({
        email,
        passwordHash,
        name,
        avatarUrl: defaultAvatar
      });

      // Initialize stats
      UserStatisticsDB.findOne(user.id);
    }

    const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error during Google Login' });
  }
};

export const getProfile = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = UsersDB.findOne({ id: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const stats = UserStatisticsDB.findOne(userId);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      },
      stats
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error fetching profile' });
  }
};

export const updateProfile = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, avatarUrl, password } = req.body;
    const updates: any = {};

    if (name) updates.name = name;
    if (avatarUrl) updates.avatarUrl = avatarUrl;
    if (password) updates.passwordHash = hashPassword(password);

    const updatedUser = UsersDB.update(userId, updates);
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatarUrl: updatedUser.avatarUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error updating profile' });
  }
};
