import { Residency } from '../entities/residency.entity';

export class SwaggerCreateHousesResponseDto {
  message = 'Houses Registered';
  data: Residency[];
}
