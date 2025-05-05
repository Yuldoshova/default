import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/docs/swagger';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)

  // Get configuration values with defaults
  const port = configService.get<number>('APP_PORT', 3000)
  const host = configService.get<string>('APP_HOST', 'localhost')
  const environment = configService.get<string>('NODE_ENV', 'development')
  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED', environment === 'development');

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Request Validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    stopAtFirstError: false,
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

  app.setGlobalPrefix('api')

  // Swagger Documentation
  if (swaggerEnabled) {
    setupSwagger(app);
  }

  // CORS
  app.enableCors();

  await app.listen(port, host,
    () => {
      console.log(`Application is running in ${environment} mode on port ${port}`)
      if (swaggerEnabled) {
        console.log(`API Documentation available at http://localhost:${port}/docs`);
      }
    }
  );

}

bootstrap();
