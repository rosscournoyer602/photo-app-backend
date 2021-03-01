import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Like {

  @PrimaryGeneratedColumn()
  id!: number

  @Column('text', { nullable: true })
  image?: string

  @Column('text', { nullable: true })
  user?: string

}