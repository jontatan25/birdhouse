import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { House } from './entities/house.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { UpdateResidencyDto } from './dto/update-residency.dto';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Residency } from './entities/residency.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
    @InjectRepository(Residency)
    private readonly residencyRepository: Repository<Residency>,
  ) {}

  async findAll(): Promise<House[]> {
    return this.houseRepository.find({ relations: ['residences'] });
  }

  async getHouseById(
    id: string,
    includeAllInfo: boolean = false,
  ): Promise<any> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id format');
    }

    const house = await this.houseRepository.findOne({
      where: { id: id },
      relations: ['residences'],
    });

    if (!house) {
      throw new NotFoundException(`house # ${id} not found`);
    }
    if (includeAllInfo) {
      return plainToClass(House, house); // transform to plain object without circular references
    } else {
      const { birds, eggs, longitude, latitude, name } = house;
      return { birds, eggs, longitude, latitude, name };
    }
  }

  registerNewHouse(createHouseDto: CreateHouseDto): Promise<House> {
    const { longitude, latitude, name } = createHouseDto;
    const id = uuidv4();
    const ubid = uuidv4();

    const creationTime = new Date();

    // TO CREATE A HOUSE OLDER THAN ONE YEAR
    // const oneYearOneDayAgo = new Date(Date.now() - 366 * 24 * 60 * 60 * 1000);

    const newBirdhouse = {
      id,
      ubid,
      birds: 0,
      eggs: 0,
      longitude,
      latitude,
      name,
      updatedAt: creationTime,
    };
    //creating instance of createHouseDto
    const house = this.houseRepository.create(newBirdhouse);

    // log the update event in the API
    console.log('EVENT: House Created.');
    console.log(`UBID: ${newBirdhouse.ubid}`);
    console.table([newBirdhouse]);

    return this.houseRepository.save(house);
  }

  async updateHouse(id: string, updateHouseDto: UpdateHouseDto): Promise<any> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id format');
    }

    try {
      //creating new entity based on the object passed
      const house = await this.houseRepository.preload({
        id: id,
        ...updateHouseDto,
      });

      if (!house) {
        throw new NotFoundException(`house # ${id} not found`);
      }

      const updateTime = new Date();
      const updatedHouse = await this.houseRepository.save(house);

      const res = {
        birds: updatedHouse.birds,
        eggs: updatedHouse.eggs,
        longitude: updatedHouse.longitude,
        latitude: updatedHouse.latitude,
        name: updatedHouse.name,
        updatedAt: updateTime,
      };

      // log the update event in the API
      console.log(`EVENT: House Updated.`);
      console.log(`UBID: ${updatedHouse.ubid}`);
      console.table([res]);

      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async updateResidency(
    id: string,
    residencyDto: UpdateResidencyDto,
  ): Promise<{
    birds: number;
    eggs: number;
    longitude: number;
    latitude: number;
    name: string;
  }> {
    const house = await this.getHouseById(id, true);

    const newResidency = new Residency();
    newResidency.birds = residencyDto.birds;
    newResidency.eggs = residencyDto.eggs;
    newResidency.date = new Date();
    newResidency.house = house;

    house.residences.push(newResidency);

    const updateTime = new Date();
    //updating house values
    house.birds = residencyDto.birds;
    house.eggs = residencyDto.eggs;
    house.updatedAt = updateTime;

    try {
      await this.residencyRepository.save(newResidency);
      const updatedHouse = await this.houseRepository.save(house);
      const res = {
        birds: updatedHouse.birds,
        eggs: updatedHouse.eggs,
        longitude: updatedHouse.longitude,
        latitude: updatedHouse.latitude,
        name: updatedHouse.name,
      };

      // log the update event in the API
      console.log('EVENT: Residency Updated.');
      console.log(`UBID: ${updatedHouse.ubid}`);
      console.table([res]);

      return res;
    } catch (err) {
      console.log(err);
    }
  }

  async getHouseByUbid(ubid: string): Promise<any> {
    if (!isUUID(ubid)) {
      throw new BadRequestException('Invalid id format');
    }

    const house = await this.houseRepository.findOne({
      where: { ubid: ubid },
      relations: ['residences'],
    });
    if (!house) {
      return house;
    } else {
      return true;
    }
  }

  async registerHouseByUbid(ubids: string[]): Promise<House[]> {
    const houses: House[] = [];

    for (const ubid of ubids) {
      if (!isUUID(ubid)) {
        throw new BadRequestException('Invalid id format');
      }
      //test for duplicate houses
      const existingHouse = await this.getHouseByUbid(ubid);
      if (existingHouse) {
        houses.push(existingHouse);
      } else {
        const house = new House();
        const id = uuidv4();
        //creating a default house
        house.ubid = ubid;
        house.id = id;
        house.birds = 0;
        house.eggs = 0;
        house.birds = 0;
        house.longitude = 0;
        house.latitude = 0;
        house.name = 'new House';
        house.updatedAt = new Date();

        // log the update event in the API
        console.log('EVENT: House Created.');
        console.log(`UBID: ${house.ubid}`);

        houses.push(await this.houseRepository.save(house));
      }
    }

    return houses;
  }

  async pruneHouses(): Promise<{ message: string }> {
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const oldHouses = await this.houseRepository
      .createQueryBuilder('house')
      .where('house.updatedAt <= :oneYearAgo', { oneYearAgo })
      .getMany();

    if (oldHouses.length === 0) {
      return { message: 'No houses to prune.' };
    }

    for (const house of oldHouses) {
      await this.houseRepository.remove(house);
    }

    console.log(`Pruned ${oldHouses.length} houses.`);
    console.table(oldHouses);
    return { message: `Pruned ${oldHouses.length} houses.` };
  }

  // async remove(id: string) {
  //   const coffee = await this.getHouseById(id);
  //   return this.houseRepository.remove(coffee);
  // }
}
