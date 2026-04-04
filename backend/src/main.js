require('reflect-metadata');

const express = require('express');
const helmet = require('helmet');
const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('./app.module');
const { AllExceptionsFilter } = require('./common/filters/all-exceptions.filter');
const { LoggingInterceptor } = require('./common/interceptors/logging.interceptor');
const { requestIdMiddleware } = require('./common/middlewares/request-id.middleware');

const BODY_LIMIT = process.env.BODY_LIMIT || '50mb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(express.json({ limit: BODY_LIMIT }));
  app.use(express.urlencoded({ limit: BODY_LIMIT, extended: true }));

  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' }));
  app.use(requestIdMiddleware);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableShutdownHooks();

  // Enable CORS - support multiple origins (comma-separated in FRONTEND_URL)
  const corsOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean)
    : ['http://localhost:3001'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation (disabled in production for security)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Bretune Accounting API')
      .setDescription('API for Bretune Accounting System')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const envPort = process.env.PORT;
  const preferredPort = envPort ? Number(envPort) : 3000;
  const candidatePorts = envPort ? [preferredPort] : [preferredPort, 3002, 3003, 3004, 3005];

  let boundPort = null;
  let lastErr = null;

  for (const p of candidatePorts) {
    try {
      await app.listen(p, '0.0.0.0');
      boundPort = p;
      break;
    } catch (e) {
      lastErr = e;
      if (e && e.code === 'EADDRINUSE' && !envPort) {
        continue;
      }
      throw e;
    }
  }

  if (!boundPort) throw lastErr;

  console.log(`🚀 Bretune Accounting API running on port ${boundPort}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 Swagger documentation available at http://localhost:${boundPort}/api`);
  }
}

bootstrap();
