import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

	@Column({ nullable: false, default: 'user' })
  role: UserRole;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

	@Column({ unique: true })
  email: string;

	@Column({ select: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;
}

export class CreateUserDto {
  @MaxLength(50)
	@ApiProperty()
  firstName: string;
  
  @MaxLength(50)
	@ApiProperty()
  lastName: string;

	@MaxLength(50)
	@ApiProperty()
  email: string;

	@IsNotEmpty()
	@ApiProperty()
  role: UserRole;

  @IsNotEmpty()
	@ApiProperty()
  password: string;
}

export class UpdateUserDto {
  @MaxLength(50)
	@ApiProperty()
  firstName: string;
  
  @MaxLength(50)
	@ApiProperty()
  lastName: string;

  @MaxLength(50)
	@ApiProperty()
  email: string;

	@IsNotEmpty()
	@ApiProperty()
  role: UserRole;
}

export class LoginUserDto {
  @IsNotEmpty()
	@ApiProperty()
  email: string;
	@ApiProperty()
  @IsNotEmpty()
  password: string;
}