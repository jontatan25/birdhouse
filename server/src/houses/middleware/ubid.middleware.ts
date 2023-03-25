import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HousesService } from '../houses.service';

@Injectable()
export class UbidMiddleware implements NestMiddleware {
  constructor(private readonly houseService: HousesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ubidHeader = req.header('X-UBID');
    if (!ubidHeader) {
      return res.status(401).send('X-UBID header is missing');
    }

    const isSoldHouse = await this.houseService.getHouseByUbid(ubidHeader);
    if (!isSoldHouse) {
      return res.status(401).send('X-UBID not valid');
    }

    next();
  }
}
