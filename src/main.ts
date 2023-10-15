import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as morgan from 'morgan';

import config from 'src/config/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
	app.use(morgan('tiny', { immediate: false }));
	
  const corsOpt = {
    origin: [
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  if (config.debug) {
    corsOpt.origin.push('http://localhost:3000');
  }
  
  app.enableCors(corsOpt);
  rateLimit({
    windowMs: 100,
    max: 1,
    keyGenerator: (req) => req.ip + req.path + req.method,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configSwagger = new DocumentBuilder()
    .setTitle("E-Menu Core")
    .setDescription("n/a")
    .setVersion("1.0")
		.addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/api/v1', app, document);

  await app.listen(config.port);
}
bootstrap();