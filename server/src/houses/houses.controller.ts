import {
  Body,
  Param,
  Controller,
  Post,
  Patch,
  Get,
  Res,
  NotFoundException,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { HousesService } from 'src/houses/houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { UpdateResidencyDto } from './dto/update-residency.dto';
import { House } from './entities/house.entity';

@Controller('house')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  findAll() {
    return this.housesService.findAll();
  }

  @Post()
  async registerNewBirdhouse(
    @Body() createHouseDto: CreateHouseDto,
    @Res() res,
  ) {
    try {
      const result = await this.housesService.registerNewHouse(createHouseDto);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to register BirdHouse' });
    }
  }

  @Patch(':id')
  async updateHouse(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateHouseDto: UpdateHouseDto,
    @Res() res,
  ) {
    try {
      const result = await this.housesService.updateHouse(id, updateHouseDto);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      } else if (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  @Post(':id/residency')
  async updateResidency(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateResidencyDto: UpdateResidencyDto,
    @Res() res,
  ) {
    try {
      const result = await this.housesService.updateResidency(id, updateResidencyDto);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      } else if (error) {
      return res.status(500).json({ message: 'Failed to update ResidencyDTO' });
    }
    }
  }

  @Get(':id')
  async getHouse(@Param('id', new ParseUUIDPipe()) id: string, @Res() res) {
    try {
      const house = await this.housesService.getHouseById(id);
      return res.status(200).json(house);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      } else if (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }

  @Post('admin/register')
  async registerHousesByUbid(
    @Body() body: { ubids: string[] },
    @Res() res,
  ): Promise<House[]> {
    try {
      const houses = await this.housesService.registerHouseByUbid(body.ubids);
      return res.status(201).json({
        message: 'Houses Registered',
        data: houses,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Post('admin/prune')
  async pruneHouses(@Res() res): Promise<Response> {
    try {
      const result = await this.housesService.pruneHouses();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to prune houses' });
    }
  }
}
