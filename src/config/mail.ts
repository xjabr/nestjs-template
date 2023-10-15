import { MailerModule } from '@nestjs-modules/mailer';

import { CONFIG } from 'src/utils/config';


export function getMailerConfig() {
  return MailerModule.forRoot({
    transport: {
      host: CONFIG.get('EMAIL_HOST'),
      port: parseInt(CONFIG.get('EMAIL_PORT')),
      secure: false,
      auth: {
        user: CONFIG.get('EMAIL_USER'),
        pass: CONFIG.get('EMAIL_PASSWORD'),
      },
    },
    defaults: {
      from: '',
    }
  });
}
