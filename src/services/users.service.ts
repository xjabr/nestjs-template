import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto, User } from 'src/entities/user.entity';
import { IRequest } from 'src/interfaces';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@Inject(REQUEST) private readonly request: IRequest
		) { }

	/**
	 * It returns a list of all users in the database
	 * @returns An array of users
	 */
	async list(): Promise<User[]> {
		return await this.userRepository.find({});
	}

	/**
	 * It creates a new user by validating the data, hashing the password, and saving the user to the
	 * database
	 * @param {CreateUserDto} data - CreateUserDto
	 * @returns The user object
	 */
	async create(data: CreateUserDto): Promise<User> {
		// validate duplicates
		const email = await this.userRepository.findOne({ where: { email: data.email } });

		if (email) throw new BadRequestException('Email already used');

		// hashing password
		data.password = await bcrypt.hash(data.password, 10);

		// save and return user
		return await this.userRepository.save({
			...data,
			status: 1,
		});
	}

	async single(id: number): Promise<User> {
		const result = await this.userRepository.findOne({ where: { id } });
		if (result === null) throw new NotFoundException('User not found');

		delete result.password;
		return result;
	}

	async update(id: number, data: UpdateUserDto | any): Promise<any> {
		if (await this.single(id) === null) throw new NotFoundException('User not found');
		return await this.userRepository.update(id, data);
	}

	async delete(id: number): Promise<any> {
		if (await this.single(id) === null) throw new NotFoundException('User not found');
		return await this.userRepository.delete(id);
	}
}