import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import config from 'src/config/common';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { 
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: payload.id } });

    if (!user) return null;

    delete user.password;
    return user; // store on req.user
  }
}