import { CONFIG } from "src/utils/config";

export default {
  debug: CONFIG.get('DEBUG') === '1',
  port: CONFIG.get('PORT') || 5001,
  secret: CONFIG.get('SECRET') || 'secret',
	sendEmail: CONFIG.get('EMAIL_DEBUG') || false
}