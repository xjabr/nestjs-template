import { Module } from '@nestjs/common';

import { getDatabaseConfig } from './config/database';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { Logger } from './services/logger.service';
import { MailService } from './services/mail.service';

@Module({
  imports: [
		getDatabaseConfig(),
		AuthModule,
		UsersModule
	],
  controllers: [],
  providers: [Logger, MailService],
})
export class AppModule {}
