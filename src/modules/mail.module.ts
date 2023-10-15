import { Module } from '@nestjs/common';
import { getMailerConfig } from 'src/config/mail';
import { Logger } from 'src/services/logger.service';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [getMailerConfig()],
  providers: [Logger, MailService],
  exports: [MailService],
})
export class MailModule {}

