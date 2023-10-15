import { MailerModule } from '@nestjs-modules/mailer';

require('dotenv').config();

export function getMailerConfig() {
  return MailerModule.forRoot({
    transport: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
    defaults: {
      from: '',
    }
  });
}
