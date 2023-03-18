import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { House } from './entities/house.entity';
import {  HousesController } from './houses.controller';
import { HousesService } from './houses.service';

@Module({imports: [TypeOrmModule.forFeature([House])], controllers: [HousesController], providers: [HousesService]})
export class HousesModule {}
