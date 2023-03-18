import { Injectable } from '@nestjs/common';
import { House } from './entities/house.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HousesService {
  private houses: House[] = [
    {
      id: 'ddeaadfa-28a2-4d4b-91a6-2a10e70b5498',
      ubid: 'a9097068-06ea-47bf-a3de-bd1272e2f6b8',
      birds: 0,
      eggs: 0,
      longitude: 123.456,
      latitude: 78.9,
      name: 'Example Birdhouse',
    },
  ];
  registerNewHouse(longitude: number, latitude: number, name: string) {
    const id = uuidv4();
    const ubid = uuidv4();

    const newBirdhouse = {
      id,
      ubid,
      birds: 0,
      eggs: 0,
      longitude,
      latitude,
      name,
    };
    this.houses.push(newBirdhouse);
  }
}
