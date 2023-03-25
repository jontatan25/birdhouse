import { Module, RequestMethod } from '@nestjs/common';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthModule } from 'src/auth/auth.module';
import { LocalStrategy } from 'src/auth/local.strategy';
import { HouseLogger } from 'src/logger/house-logger.service';
import { House } from './entities/house.entity';
import { Residency } from './entities/residency.entity';
import { HousesController } from './houses.controller';
import { HousesService } from './houses.service';
import { UbidMiddleware } from './middleware/ubid.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([House, Residency]), AuthModule],
  controllers: [HousesController],
  providers: [HousesService, HouseLogger, LocalStrategy],
})
export class HousesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UbidMiddleware)
      .forRoutes(
        { path: 'houses', method: RequestMethod.POST },
        { path: 'houses/:id', method: RequestMethod.PATCH },
        { path: 'houses/:id/residency', method: RequestMethod.POST },
      );
  }
}
