import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BirdhouseController } from './birdhouse/birdhouse.controller';

@Module({
  imports: [],
  controllers: [AppController, BirdhouseController],
  providers: [AppService],
})
export class AppModule {}
