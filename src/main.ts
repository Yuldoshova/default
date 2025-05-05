import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)

   // Get configuration values with defaults
  const port = configService.get<number>('APP_PORT', 3000)
  const host = configService.get<string>('APP_HOST', 'localhost')
  const environment = configService.get<string>('NODE_ENV', 'development')

  await app.listen(port, host,
    () => console.log(`Application is running in ${environment} mode on port ${port}`)
  );

}

bootstrap();
