import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private allowedRegistrations = ['ABC123', 'DEF456', 'GHI789'];
    
  use(req: Request, res: Response, next: NextFunction) {
    const registration = req.headers['registration']?.toString();

    if (!registration || !this.allowedRegistrations.includes(registration)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
