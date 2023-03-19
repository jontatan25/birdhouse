import { IsDate, IsNumber } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
export class UpdateResidencyDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @IsNumber()
  eggs: number;
  @IsNumber()
  birds: number;
}
