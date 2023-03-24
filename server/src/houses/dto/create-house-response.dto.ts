import { Exclude } from 'class-transformer';

export class CreateHouseResponseDto {
  id: string;
  ubid: string;
  birds: number;
  eggs: number;
  longitude: number;
  latitude: number;
  name: string;
  
  @Exclude()
  updatedAt: Date;
}
