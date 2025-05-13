import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { 
  BadRequestException, 
  ValidationError, 
  ValidationPipe,
  VersioningType 
} from '@nestjs/common';
import { setupSwagger } from './common/docs/swagger';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Add logger levels based on environment
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn', 'log'] 
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const configService = app.get(ConfigService);

  // Get configuration values with defaults
  const port = configService.get<number>('APP_PORT', 3000);
  const host = configService.get<string>('APP_HOST', 'localhost');
  const environment = configService.get<string>('NODE_ENV', 'development');
  const globalPrefix = configService.get<string>('API_PREFIX', 'api');
  
  // Security enhancements
  if (environment === 'production') {
    app.use(helmet());
  }
  
  // Compression for better performance
  app.use(compression());

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Request Validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    stopAtFirstError: false,
    transformOptions: {
      enableImplicitConversion: false,
    },
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const errors = validationErrors.map(error => {
        const constraints = error.constraints ? Object.values(error.constraints) : [];
        return {
          property: error.property,
          message: constraints.length > 0 ? constraints[0] : 'Invalid value',
          constraints: constraints,
          value: error.value
        };
      });

      return new BadRequestException({
        message: 'Validation failed',
        errors: errors
      });
    }
  }));

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Api prefix
  app.setGlobalPrefix(globalPrefix);

  // Swagger Documentation
  setupSwagger(app);

  // CORS setup with more options
  app.enableCors({
    origin: configService.get<string | string[]>('CORS_ORIGINS', '*'),
    methods: configService.get<string>('CORS_METHODS', 'GET,HEAD,PUT,PATCH,POST,DELETE'),
    credentials: configService.get<boolean>('CORS_CREDENTIALS', true),
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours
  });

  // Graceful shutdown handling
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach(signal => {
    process.on(signal, async () => {
      console.log(`Received ${signal}, gracefully shutting down...`);
      await app.close();
      process.exit(0);
    });
  });

  await app.listen(port, host, () => {
    const url = `http://${host}:${port}`;
    console.log(`🚀 Application is running in ${environment.toUpperCase()} mode`);
    console.log(`🌐 API endpoints available at ${url}/${globalPrefix}`);
    
    if (environment !== 'production') {
      console.log(`📝 API Documentation available at ${url}/docs`);
    }
  });
}

bootstrap().catch(err => {
  console.error('❌ Error starting server:', err);
  process.exit(1);
});