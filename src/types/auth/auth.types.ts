import { Request } from 'express';
import { User } from 'src/entities';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface DefaultRequest extends Request {
  sessionID: string;
}