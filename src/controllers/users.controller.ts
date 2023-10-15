import { Body, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiController } from 'src/decorators/api.decorator';
import { Authenticated, Roles } from 'src/decorators/auth.decorator';
import { CreateUserDto, UpdateUserDto, UserRole } from 'src/entities/user.entity';
import { UsersService } from 'src/services/users.service';
import { successResponse } from 'src/utils/responses';

@ApiController('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Authenticated()
	@ApiBearerAuth()
  @Get('/me')
  async me(@Req() req) {
    return successResponse(req.user);
  }

  @Authenticated()
	@ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Post('/create')
  async create(@Body() body: CreateUserDto) {
    const result = await this.usersService.create(body);
    delete result.password;
    
    return successResponse(result);
  }

  @Authenticated()
	@ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Get('/list')
  async list() {
    const result = await this.usersService.list();
    return successResponse(result);
  }

  @Authenticated()
	@ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Get('/single/:id')
  async single(@Param('id') id) {
    const result = await this.usersService.single(id);
    return successResponse(result);
  }

  @Authenticated()
	@ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Patch('/single/:id')
  async update(@Param('id') id, @Body() body: UpdateUserDto) {
    const result = await this.usersService.update(id, body);
    return successResponse(result);
  }

  @Authenticated()
	@ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Delete('/single/:id')
  async delete(@Param('id') id) {
    const result = await this.usersService.delete(id);
    return successResponse(result);
  }
}