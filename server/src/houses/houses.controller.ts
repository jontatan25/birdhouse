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
} from '@nestjs/common';
import { HousesService } from 'src/houses/houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { UpdateResidencyDto } from './dto/update-residency.dto';

@Controller('house')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  findAll() {
    return this.housesService.findAll();
  }

  @Post()
  registerNewBirdhouse(@Body() createHouseDto: CreateHouseDto) {
    return this.housesService.registerNewHouse(createHouseDto);
    // return res.status(201).json(registerResult);
  }

  @Patch(':id')
  updateHouse(@Param('id') id: string, @Body() updateHouseDto: UpdateHouseDto) {
    return this.housesService.updateHouse(id, updateHouseDto);
    // return res.status(201).json(updateHouseResult);
  }
  //PENDING UNTIL RESIDENCY IS CREATED
  @Post(':id/residency')
  updateResidency(
    @Param('id') id: string,
    @Body() updateResidencyDto: UpdateResidencyDto,
  ) {
    return this.housesService.updateResidency(id, updateResidencyDto);
  }

  @Get(':id')
  async getHouse(@Param('id') id: string, @Res() res) {
    try {
      const house = await this.housesService.getHouseById(id);
      return res.status(200).json(house);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      } else if (error instanceof BadRequestException) {
        return res.status(400).json({ message: error.message });
      } else if (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
}
