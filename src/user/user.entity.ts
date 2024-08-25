import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  isTwoFactorEnabled: boolean;

  @Column({ nullable: true })
  thirdPartyId: string;

  @Column({ nullable: true })
  provider: string;

  // Add any other fields needed
}
