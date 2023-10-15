import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/services/auth.service';
import config from '../config/common';
import { AuthController } from '../controllers/auth.controller';
import { Session } from '../entities/session.entity';
import { UsersModule } from '../modules/users.module';
import { AuthStrategy } from '../strategies/auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: config.secret,
      signOptions: { expiresIn: '14d' }
    })
  ],
  providers: [AuthService, AuthStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}