import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { House } from './entities/house.entity';
import { Residency } from './entities/residency.entity';
import {  HousesController } from './houses.controller';
import { HousesService } from './houses.service';

@Module({imports: [TypeOrmModule.forFeature([House,Residency])], controllers: [HousesController], providers: [HousesService]})
export class HousesModule {}
