import { Body, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiController } from 'src/decorators/api.decorator';

import { LoginUserDto } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';
import { successResponse } from 'src/utils/responses';

@ApiController('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const result = await this.authService.validateUser(body.email, body.password);
    
    if (!result) {
      throw new UnauthorizedException();
    }

    const auth = await this.authService.signPayload(result);
    return successResponse(auth);
  }

  @Post('/security/forgot')
  async forgotPassword(@Body() body) {
    const result = await this.authService.forgotPassword(body);
    return successResponse(result);
  }

  @Get(`/security/session/:id`)
  async checkSession(@Param('id') id) {
    const result = await this.authService.checkSession(id);
    return successResponse(result);
  }

  @Post('/recovery/password')
  async recoveryPassword(@Body() body) {
    const result = await this.authService.recoveryPassword(body);
    return successResponse(result);
  }
}