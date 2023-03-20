import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateHouseBulkdDto {
  @IsUUID("all", { each: true })
  ubids: string;
}
