import { Exclude } from 'class-transformer';
import { Residency } from '../entities/residency.entity';

export class UpdateResidencyResponseDto {
 
  birds: number;
  eggs: number;
  longitude: number;
  latitude: number;
  name: string;

  @Exclude()
  id: string;

  @Exclude()
  ubid: string;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  residences: Residency[];
}
