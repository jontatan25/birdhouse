import { Body, Param, Controller, Post, Patch, Get, Res } from '@nestjs/common';
import { HousesService } from 'src/houses/houses.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('house')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Post()
  registerNewBirdhouse(@Body() body, @Res() res) {
    const registerResult = this.housesService.registerNewHouse(body);
    return res.status(201).json(registerResult);
  }

  @Patch(':id')
  updateHouse(@Param('id') id: string, @Body() body, @Res() res) {
    const updateHouseResult = this.housesService.updateHouse(id, body);
    return res.status(201).json(updateHouseResult);
  }

  @Post(':id/residency')
  updateResidency(@Param('id') id: string, @Body() body, @Res() res) {
    const updateResidencyResult = this.housesService.updateResidency(id, body);

    return res.status(201).json(updateResidencyResult);
  }

  @Get(':id')
  getHouse(@Param('id') id: string, @Res() res) {
    const getHouseById = this.housesService.getHouseById(id);
    return res.status(201).json(getHouseById);
  }
}
