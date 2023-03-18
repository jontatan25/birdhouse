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

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
  ) {}

  async findAll(): Promise<House[]> {
    return this.houseRepository.find();
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

  updateResidency(id: string, body: UpdateResidencyDto) {
    const { eggs } = body;
    return 'UpdatedResidency' + ' ' + id + ' ' + eggs;
  }

  async getHouseById(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id format');
    }

    const house = await this.houseRepository.findOne({
      where: { id: id },
    });

    if (!house) {
      throw new NotFoundException(`house # ${id} not found`);
    }

    return house;
  }

  async remove(id: string) {
    const coffee = await this.getHouseById(id);
    return this.houseRepository.remove(coffee);
  }
}
