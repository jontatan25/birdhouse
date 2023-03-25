import {
  Body,
  Param,
  Controller,
  Post,
  Patch,
  Get,
  Res,
  NotFoundException,
  ParseUUIDPipe,
  Delete,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { HousesService } from 'src/houses/houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { UpdateResidencyDto } from './dto/update-residency.dto';
import { House } from './entities/house.entity';
import { SwaggerCreateHousesResponseDto } from './swagger/create-houses-res.dto';
import { SwaggerPruneHousesResponseDto } from './swagger/delete-older-houses.dto';
import { SwaggerUpdateHouseResponseDto } from './swagger/update-house-res.dto';
import { SwaggerUpdateResidencyResponseDto } from './swagger/update-residency-res.dto';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  findAll() {
    return this.housesService.findAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The created house object as per BIRD guidelines',
    type: SwaggerUpdateHouseResponseDto,
  })
  async registerNewBirdhouse(
    @Body() createHouseDto: CreateHouseDto,
    @Res() res,
  ) {
    try {
      const result = await this.housesService.registerNewHouse(createHouseDto);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to register BirdHouse' });
    }
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The updated house object as per BIRD guidelines',
    type: SwaggerUpdateHouseResponseDto,
  })
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
  @ApiResponse({
    status: 201,
    description: 'The updated house object as per BIRD guidelines',
    type: SwaggerUpdateResidencyResponseDto,
  })
  async updateResidency(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateResidencyDto: UpdateResidencyDto,
    @Res() res,
  ) {
    try {
      const result = await this.housesService.updateResidency(
        id,
        updateResidencyDto,
      );
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      } else if (error) {
        return res
          .status(500)
          .json({ message: 'Failed to update ResidencyDTO' });
      }
    }
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The updated house object as per BIRD guidelines',
    type: SwaggerUpdateHouseResponseDto,
  })
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
  @UseGuards(AuthGuard('basic'))
  @ApiResponse({
    status: 201,
    description:
      'The created houses object with default values, as per BIRD guidelines. If a house is already registered No modifications will be made to that house. To see if all the operations were succesfully made check the console or the log file located at logs/houses.log',
    type: SwaggerCreateHousesResponseDto,
  })
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

  @Delete('admin/prune')
  @UseGuards(AuthGuard('basic'))
  @ApiResponse({
    status: 200,
    description:
      "Pruning birdhouses that haven't been updated in a year: the operation's result.",
    type: SwaggerPruneHousesResponseDto,
  })
  async pruneHouses(@Res() res): Promise<Response> {
    try {
      const result = await this.housesService.pruneHouses();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to prune houses' });
    }
  }
}
