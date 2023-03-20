import { Module, RequestMethod } from '@nestjs/common';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { House } from './entities/house.entity';
import { Residency } from './entities/residency.entity';
import { HousesController } from './houses.controller';
import { HousesService } from './houses.service';
import { ubidMiddleware } from './middleware/ubid.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([House, Residency])],
  controllers: [HousesController],
  providers: [HousesService],
})
export class HousesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ubidMiddleware)
      .forRoutes(
        { path: 'house/:id', method: RequestMethod.PATCH },
        { path: 'house/:id/residency', method: RequestMethod.POST },
        { path: 'house/admin/register', method: RequestMethod.POST },
        { path: 'house/admin/prune', method: RequestMethod.POST },
      );
  }
}
