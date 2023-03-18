import { IsNumber } from 'class-validator';
export class UpdateResidencyDto {
    @IsNumber()
    eggs: number;
}
