import { Request } from 'express';
import User from '../../models/userModel.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}