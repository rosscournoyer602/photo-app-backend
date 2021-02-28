import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Person {

  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: true })
  name?: string

  @Column('text', { nullable: true })
  avatar?: string

}