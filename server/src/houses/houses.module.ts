import { Module, RequestMethod } from '@nestjs/common';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { HouseLogger } from 'src/logger/house-logger.service';
import { House } from './entities/house.entity';
import { Residency } from './entities/residency.entity';
import { HousesController } from './houses.controller';
import { HousesService } from './houses.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UbidMiddleware } from './middleware/ubid.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([House, Residency])],
  controllers: [HousesController],
  providers: [HousesService, HouseLogger],
})
export class HousesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UbidMiddleware)
      .forRoutes(
        { path: 'houses/:id', method: RequestMethod.PATCH },
        { path: 'houses/:id/residency', method: RequestMethod.POST },
        { path: 'houses/admin/register', method: RequestMethod.POST },
        { path: 'houses/admin/prune', method: RequestMethod.POST },
      );

    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'houses/admin/register', method: RequestMethod.POST },
        { path: 'houses/admin/prune', method: RequestMethod.POST },
      );
  }
}
