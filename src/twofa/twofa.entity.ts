import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class TwoFa{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

}