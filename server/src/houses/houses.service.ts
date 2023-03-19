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

  async getHouseById(id: string) {
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
    return plainToClass(House, house); // transform to plain object without circular references
  }

  registerNewHouse(createHouseDto: CreateHouseDto) {
    const { longitude, latitude, name } = createHouseDto;
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
    //creating instance of createHouseDto
    const house = this.houseRepository.create(newBirdhouse);
    return this.houseRepository.save(house);
  }

  async updateHouse(id: string, updateHouseDto: UpdateHouseDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id format');
    }

    try {
      //creating new entity based on the object passes\
      const house = await this.houseRepository.preload({
        id: id,
        ...updateHouseDto,
      });

      if (!house) {
        throw new NotFoundException(`house # ${id} not found`);
      }
      return this.houseRepository.save(house);
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
    const house = await this.getHouseById(id);

    const newResidency = new Residency();
    newResidency.birds = residencyDto.birds;
    newResidency.eggs = residencyDto.eggs;
    newResidency.date = new Date();
    newResidency.house = house;

    house.residences.push(newResidency);

    try {
      await this.residencyRepository.save(newResidency);
      const updatedHouse = await this.houseRepository.save(house);
      const { birds, eggs, longitude, latitude, name } = updatedHouse;
      return { birds, eggs, longitude, latitude, name };
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: string) {
    const coffee = await this.getHouseById(id);
    return this.houseRepository.remove(coffee);
  }
}
