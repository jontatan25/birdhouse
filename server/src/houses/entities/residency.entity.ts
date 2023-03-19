import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { House } from './house.entity';

@Entity()
export class Residency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  birds: number;

  @Column()
  eggs: number;

  @Column()
  date: Date;

  @ManyToOne((type) => House, (house) => house.residences)
  house: House;
}
