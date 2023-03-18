import { Body, Param, Controller, Post, Patch, Get, Res } from '@nestjs/common';
import { HousesService } from 'src/houses/houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { UpdateResidencyDto } from './dto/update-residency.dto';

@Controller('house')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Post()
  registerNewBirdhouse(@Body() createHouseDto: CreateHouseDto, @Res() res) {
    const registerResult = this.housesService.registerNewHouse(createHouseDto);
    return res.status(201).json(registerResult);
  }

  @Patch(':id')
  //id Changed to ntype number to test transformation, param also modified
  updateHouse(@Param('id') id: number, @Body() updateHouseDto:UpdateHouseDto, @Res() res) {
    const updateHouseResult = this.housesService.updateHouse(''+id, updateHouseDto);
    return res.status(201).json(updateHouseResult);
  }

  @Post(':id/residency')
  updateResidency(@Param('id') id: string, @Body() updateResidencyDto:UpdateResidencyDto, @Res() res) {
    const updateResidencyResult = this.housesService.updateResidency(id, updateResidencyDto);

    return res.status(201).json(updateResidencyResult);
  }

  @Get(':id')
  getHouse(@Param('id') id: string, @Res() res) {
    const getHouseById = this.housesService.getHouseById(id);
    return res.status(201).json(getHouseById);
  }
}
