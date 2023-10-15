import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  uuid: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  expires: string;
}