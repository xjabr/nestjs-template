import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import config from 'src/config/common';
import { Logger } from './logger.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private logger: Logger
  ) {}

  public async sendEmail(from, to, subject, html, attachments: any[] = []) {
    try {
			if (config.sendEmail) {
				await this.mailerService.sendMail({
					from: from,
					to: config.debug ? 'gabriele.lanzafame03@gmail.com' : to,
					subject: subject,
					html: html,
					attachments: attachments
				});
			}

      this.logger.info('NEW EMAIL SERVICE: ', 'MailService.sendEmail');
      this.logger.info(`from: ${from}`, 'MailService.sendEmail');
      this.logger.info(`to: ${to}`, 'MailService.sendEmail');
      this.logger.info(`subject: ${subject}`, 'MailService.sendEmail');
      this.logger.info(`html: ${html}`, 'MailService.sendEmail');
    } catch (err) {
      this.logger.info(err, 'MailService.sendEmail.exception')
      return false;
    }

    return true;
  }
}
