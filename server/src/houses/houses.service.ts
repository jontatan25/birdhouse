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
import { HouseLogger } from 'src/logger/house-logger.service';
import { CreateHouseResponseDto } from './dto/create-house-response.dto';
import { UpdateHouseResponseDto } from './dto/update-house-response.dto';
import { UpdateResidencyResponseDto } from './dto/update-residency-response.dto';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
    @InjectRepository(Residency)
    private readonly residencyRepository: Repository<Residency>,
    private readonly logger: HouseLogger,
  ) {}

  async findAll(): Promise<House[]> {
    return this.houseRepository.find({ relations: ['residences'] });
  }

  async getHouseById(
    id: string,
    includeAllInfo: boolean = false,
  ): Promise<any> {
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
      const { birds, eggs, longitude, latitude, name, residences } = house;
      return { birds, eggs, longitude, latitude, name, residences };
    }
  }

  async registerNewHouse(
    createHouseDto: CreateHouseDto,
  ): Promise<CreateHouseResponseDto> {
    const { longitude, latitude, name } = createHouseDto;
    const id = uuidv4();
    const ubid = uuidv4();
    const creationTime = new Date();

    // UNCOMMENT AND SET AS 'updatedAt' in newBirdhouse TO CREATE A HOUSE OLDER THAN ONE YEAR.
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

    const savedhouse = this.houseRepository
      .save(house)
      .then((savedHouse: House) => {
        // log the update event in the API
        this.logger.log(`EVENT: House Created. UBID: ${newBirdhouse.ubid}`);
        //printing table for visual purposes.- will not be stored in log
        console.table([savedHouse]);
        // Transforming the saved house into a CreateHouseResponseDto
        const houseDto = plainToClass(CreateHouseResponseDto, savedHouse);
        return houseDto;
      })
      .catch((err: Error) => {
        this.logger.error(err.message, err.stack);
        throw err;
      });

    return savedhouse;
  }

  async updateHouse(
    id: string,
    updateHouseDto: UpdateHouseDto,
  ): Promise<UpdateHouseDto> {
    //creating new entity based on the object passed
    const house = await this.houseRepository.preload({
      id: id,
      ...updateHouseDto,
    });

    if (!house) {
      throw new NotFoundException(`house # ${id} not found`);
    }

    house.updatedAt = new Date();

    const updatedHouse = await this.houseRepository
      .save(house)
      .then((updatedHouse: House) => {
        // log the update event in the API
        this.logger.log(`EVENT: House Updated. UBID: ${updatedHouse.ubid}`);
        //printing table for visual purposes.- will not be stored in log
        console.table([updatedHouse]);
        const houseDto = plainToClass(UpdateHouseResponseDto, updatedHouse);
        return houseDto;
      })
      .catch((err: Error) => {
        this.logger.error(err.message, err.stack);
        throw err;
      });

    return updatedHouse;
  }

  async updateResidency(
    id: string,
    residencyDto: UpdateResidencyDto,
  ): Promise<UpdateResidencyResponseDto> {
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

      // log the update event in the API
      this.logger.log(`EVENT: Residency Updated. UBID: ${updatedHouse.ubid}`);

      const houseDto = plainToClass(UpdateResidencyResponseDto, updatedHouse);

      //printing table for visual purposes.- will not be stored in log
      if (updatedHouse.residences) {
        delete updatedHouse.residences;
      }
      console.table([updatedHouse]);

      return houseDto;
    } catch (error) {
      this.logger.error(error, error.stack);
      throw error;
    }
  }

  async getHouseByUbid(ubid: string): Promise<House> {
    if (!isUUID(ubid)) {
      throw new BadRequestException('Invalid id format');
    }

    const house = await this.houseRepository.findOne({
      where: { ubid: ubid },
      relations: ['residences'],
    });

    return house;
  }

  async registerHouseByUbid(ubids: string[]): Promise<House[]> {
    const houses: House[] = [];
    let createdHouses = 0;

    for (const ubid of ubids) {
      if (!isUUID(ubid)) {
        throw new BadRequestException('Invalid id format');
      }
      //check for duplicate houses
      const existingHouse = await this.getHouseByUbid(ubid);
      if (existingHouse) {
        houses.push(existingHouse);
        this.logger.log(
          `EVENT: House Is already the registered. UBID: ${existingHouse.ubid}`,
        );
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

        try {
          const createdHouse = await this.houseRepository.save(house);
          createdHouses++;
          // log the update event in the API
          this.logger.log(`EVENT: House Created. UBID: ${house.ubid}`);
          houses.push(createdHouse);
        } catch (error) {
          this.logger.error(error, error.stack);
          throw error;
        }
      }
    }
    this.logger.log(
      `EVENT: ${createdHouses}/${houses.length} houses added in bulk By an Admin`,
    );
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

    this.logger.log(`Pruned ${oldHouses.length} houses.`);
    //printing table for visual purposes.- will not be stored in log
    console.table(oldHouses);
    return { message: `Pruned ${oldHouses.length} houses.` };
  }
}
