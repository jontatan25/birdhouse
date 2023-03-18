import { IsString, IsNumber } from 'class-validator';

export class CreateHouseDto {
  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;

  @IsString()
  name: string;
}
