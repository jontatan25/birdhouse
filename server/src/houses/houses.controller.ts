import { Body, Param, Controller, Post, Patch, Get, Res } from '@nestjs/common';
import { HousesService } from 'src/houses/houses.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('house')
export class BirdhouseController {
  constructor(private readonly housesService: HousesService) {}

  @Post()
  registerNewBirdhouse(@Body() body, @Res() res) {
    const { longitude, latitude, name } = body;
    return this.housesService.registerNewHouse(longitude, latitude, name);
  }

  @Patch(':id')
  updateHouse(@Param('id') id: string, @Body() body) {
    return 'Updating ' + id + '';
  }

  @Post(':id/residency')
  updateResidency(@Param('id') id: string, @Body() body, @Res() res) {
    const newBirdhouse = 'Updating residency' + id;

    return res.status(201).json(newBirdhouse);
  }

  @Get(':id')
  getHouse(@Param('id') id: string) {
    return 'GET REQUEST' + id;
  }
}
