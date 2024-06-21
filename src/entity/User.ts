import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User {
  @PrimaryColumn()
  email!: string;

  @Column()
  password!: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile!: Profile;
}
