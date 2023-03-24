import { Exclude } from 'class-transformer';

export class UpdateHouseResponseDto {
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
}
