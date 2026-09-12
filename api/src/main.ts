import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { json, urlencoded } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const logger = new Logger('Bootstrap');

  app.use(helmet());
  app.use(compression());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://buildmyresume.live',
      'https://www.buildmyresume.live',
      'httpa://www.build-my-resume-nu.vercel.app'
      process.env.FRONTEND_URL,
    ].filter(Boolean) as string[],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Accept',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  await app.init();
  return server;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((srv) => {
    srv.listen(process.env.PORT || 4000, () => {
      Logger.log(`🚀 Running on port ${process.env.PORT || 4000}`, 'Bootstrap');
    });
  });
}

// Vercel serverless handler
export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};