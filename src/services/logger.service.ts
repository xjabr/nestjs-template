import { Global, Injectable, LoggerService, Module } from '@nestjs/common';
import * as cls from 'cls-hooked';
import * as winston from 'winston';

const { combine, printf, colorize, timestamp, label, prettyPrint } =
  winston.format;

const myFormat = printf(
  ({ level, message, correlation, pid, ip, reqId, classInstance }) => {
    return `${new Date().toISOString()} - ${classInstance} - ${level.toUpperCase()} -> ${message}`;
  },
);

export const customLogger = winston.createLogger({
  level: 'debug',
  format: combine(myFormat),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'server.log' })],
  exitOnError: false,
});

@Injectable()
export class Logger implements LoggerService {
  log(message: string, classInstance: string) {
    const nm = cls.getNamespace('core');
    customLogger.log('debug', message, this.buildMetadata(classInstance, nm));
  }

  info(message: string, classInstance: string) {
    const nm = cls.getNamespace('core');
    customLogger.info(message, this.buildMetadata(classInstance, nm));
  }

  error(message: string, trace: string, classInstance: string) {
    const nm = cls.getNamespace('core');
    customLogger.error(
      message + ': ' + trace,
      this.buildMetadata(classInstance, nm),
    );
  }

  warn(message: string, classInstance: string) {
    const nm = cls.getNamespace('core');
    customLogger.warn(message, this.buildMetadata(classInstance, nm));
  }

  debug(message: string, classInstance: string) {
    const nm = cls.getNamespace('core');
    customLogger.debug(message, this.buildMetadata(classInstance, nm));
  }

  verbose(message: string, classInstance: string) {
    const nm = cls.getNamespace('core');
    customLogger.verbose(message, this.buildMetadata(classInstance, nm));
  }

  private buildMetadata(classInstance: string, nm?: any) {
    return {
      pid: process.pid,
      ip: nm ? nm.get('userIp') : undefined,
      classInstance,
      correlation: nm ? nm.get('correlationId') : undefined,
      reqId: nm ? nm.get('reqId') : undefined,
    };
  }
}

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggingModule {}
