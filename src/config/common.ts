require('dotenv').config()

export default {
  debug: process.env.DEBUG === '1',
  secret: process.env.SECRET || 'secret',
  port: process.env.PORT || 5001,
	sendEmail: process.env.EMAIL_DEBUG || false
}