import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Photo {

  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: false })
  index!: number

  @Column('text', { nullable: false })
  name!: string

  @Column('text', { nullable: false })
  src!: string
}