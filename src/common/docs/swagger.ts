import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

/**
 * Sets up Swagger documentation for the API
 * Only enabled in non-production environments by default
 */
export const setupSwagger = (app: INestApplication): void => {
    const configService = app.get(ConfigService);
    const nodeEnv = configService.get<string>('NODE_ENV');
    const isProduction = nodeEnv === 'production';

    // Only enable Swagger in non-production environments unless explicitly configured
    if (isProduction && !configService.get<boolean>('SWAGGER_ENABLED')) {
        return;
    }

    const options = new DocumentBuilder()
        .setTitle('NestJS Starter API Documentation')
        .setVersion('1.0.0')
        .addTag('apis')
        .build();

    const document = SwaggerModule.createDocument(app, options);

    // Add custom Swagger configuration
    SwaggerModule.setup('docs', app, document, {
        explorer: true,
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            docExpansion: 'list',
            filter: true,
            showCommonExtensions: true,
            syntaxHighlight: {
                theme: 'monokai'
            },
            tryItOutEnabled: true,
            defaultModelsExpandDepth: 3,
            defaultModelExpandDepth: 3,
            jsonDocumentUrl: 'swagger/json',
        },
        customSiteTitle: 'NestJS Starter API Documentation',
        customfavIcon: 'https://nestjs.com/img/favicon.png'
    });
}