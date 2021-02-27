import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Person } from './Person'

@Entity()
export class User {

  @PrimaryColumn()
  email!: string;

  @Column()
  password!: string
  
  @OneToOne(type => Person)
  @JoinColumn()
  person!: Person
}