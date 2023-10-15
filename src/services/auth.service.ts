import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

import * as moment from 'moment';
import { Session } from 'src/entities/session.entity';
import { User } from 'src/entities/user.entity';
import { Logger } from './logger.service';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
		private mailService: MailService,
		private logger: Logger,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.userRepository.createQueryBuilder().addSelect('`User`.`password` AS `User_password`').where("email = :email", { email }).getOne()

    if (user == null) return;

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return null;
    }

    if (!user.isActive) {
      return null;
    }

    return user;
  }

  async signPayload(user: User): Promise<{ access_token: string }> {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(body) {
    const user = await this.userRepository.findOneBy({ email: body.email });

    if (user === null)
      return `Controlla la tua casella di posta.`;

    const uuid = randomUUID();
    const expires = moment().add(1, 'hour').toDate().getTime().toString();

    const session = await this.sessionRepository.save({
      uuid: uuid,
      expires: expires,
      email: body.email,
    });

    const ok = await this.mailService.sendEmail(
      'noreply@cips.it',
      body.email,
      'Recupero Password - CIPS Area Resellers',
      `
      Gentile ${user.firstName} ${user.lastName},
      Abbiamo ricevuto la tua richiesta di recupero password per accedere all'Area Resellers di CIPS. Per favore, clicca sul seguente link per reimpostare la tua password:

      https://resellers.cips.it/recovery?session=${session.uuid}&expires=${expires}

      Assicurati di creare una password sicura e complessa per proteggere la tua privacy e la sicurezza delle tue informazioni personali.

      Se hai bisogno di ulteriore assistenza, non esitare a contattarci al seguente indirizzo e-mail: supporto@cips.it

      Cordiali saluti,
      Il team di CIPS
      `,
    );

    this.logger.info(`${ok ? 'SENT' : 'NOT SENT'} - New request for forgotten password from ${user.email} at ${moment().format("DD/MM/YYYY hh:mm:ss A")}, session: ${uuid}`, "AuthService.forgotPassword");

    return `Controlla la tua casella di posta.`;
  }

  async recoveryPassword(body) {
    const { sessionUuid, password } = body;

    const session = await this.sessionRepository.findOneBy({ uuid: sessionUuid });
    const user = await this.userRepository.findOneBy({ email: session.email });

    if (user === null) throw new BadRequestException('User not found');
    // check if session is expired
    if (new Date().getTime() >= parseInt(session.expires)) throw new ForbiddenException("Session expired")
    
    const result = await this.userRepository.update({ email: session.email }, { password: await bcrypt.hash(password, 10) });
    
    // delete session
    await this.sessionRepository.delete(session.id);

    this.logger.info(`Password recovered from ${user.email} at ${moment().format("DD/MM/YYYY hh:mm:ss A")}, session: ${sessionUuid}`, "AuthService.recoveryPassword");
    return result;
  }

  async checkSession(sessionUuid) {
    const session = await this.sessionRepository.findOneBy({ uuid: sessionUuid });
    if (!session) throw new NotFoundException("Session expired")
    if (new Date().getTime() >= parseInt(session.expires)) throw new ForbiddenException("Session expired")
    return true;
  }
}