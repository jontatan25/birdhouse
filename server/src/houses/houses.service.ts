import { Injectable, NotFoundException } from '@nestjs/common';
import { House } from './entities/house.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { UpdateResidencyDto } from './dto/update-residency.dto';

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
  registerNewHouse(body:CreateHouseDto) {
    const { longitude, latitude, name } = body;
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
    return newBirdhouse;
  }

  updateHouse(id: string, body:UpdateHouseDto) {
    const { longitude, latitude, name } = body;
    return (
      'UpdatedHouse' + ' ' + id + ' ' + longitude + ' ' + latitude + ' ' + name
    );
  }
  updateResidency(id: string, body:UpdateResidencyDto) {
    const { eggs } = body;
    return 'UpdatedResidency' + ' ' + id + ' ' + eggs;
  }
  getHouseById(id: string) {
    const house = this.houses.find(house => house.id === id);
    if (!house) {
        throw new NotFoundException(`House ${id} not found`);
    } 
    return house
  }
}
