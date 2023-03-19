import { Length } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Residency } from './residency.entity';

@Entity()
export class House {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ubid: string;

  @Column("int")
  birds: number;

  @Column("int")
  eggs: number;

  @Column('decimal', { precision: 9, scale: 6 })
  longitude: number;

  @Column('decimal', { precision: 9, scale: 6 })
  latitude: number;

  @Column('text')
  @Length(4, 16)
  name: string;

  @JoinTable()
  @OneToMany((type) => Residency, (residency) => residency.house)
  residences: Residency[];
}
