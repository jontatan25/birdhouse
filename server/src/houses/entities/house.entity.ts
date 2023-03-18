import { Column, Entity, PrimaryGeneratedColumn  } from "typeorm";

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

  @Column("decimal", { precision: 9, scale: 6 })
  longitude: number;

  @Column("decimal", { precision: 9, scale: 6 })
  latitude: number;

  @Column("text")
  name: string;
}
