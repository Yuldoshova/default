import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Sets up Swagger documentation for the API
 * Enhanced with additional features for better developer experience
 */
export const setupSwagger = (app: INestApplication): void => {
    const configService = app.get(ConfigService);
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';
    const appVersion = configService.get<string>('APP_VERSION', '1.0.0');
    const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED', !isProduction);

    // Only enable Swagger in non-production environments unless explicitly configured
    if (!swaggerEnabled) {
        return;
    }

    // Read package.json for additional metadata
    let packageInfo = { name: 'NestJS API', description: 'API Documentation' };
    try {
        const packagePath = path.resolve('package.json');
        if (fs.existsSync(packagePath)) {
            const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            packageInfo = {
                name: packageData.name || packageInfo.name,
                description: packageData.description || packageInfo.description
            };
        }
    } catch (error) {
        console.warn('Could not read package.json:', error.message);
    }

    // Enhanced DocumentBuilder with more details
    const options = new DocumentBuilder()
        .setTitle(`${packageInfo.name} API`)
        .setDescription(packageInfo.description)
        .setVersion(appVersion) 
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth' // This name here is important for reference in controller decorators
        )
        // Add other security schemes if needed
        .addServer(`${configService.get('API_URL', `http://localhost:${configService.get('APP_PORT', 3000)}`)}`)
        .build();

    // Configure additional Swagger document options
    const swaggerDocumentOptions: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
        extraModels: [],
        ignoreGlobalPrefix: false,
        deepScanRoutes: true,
    };

    const document = SwaggerModule.createDocument(app, options, swaggerDocumentOptions);

    // Optional: Save Swagger JSON to file for external documentation tools
    if (nodeEnv === 'development') {
        const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
        try {
            fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), { encoding: 'utf8' });
            console.log(`Swagger JSON saved to: ${outputPath}`);
        } catch (error) {
            console.warn('Could not write swagger-spec.json:', error.message);
        }
    }

    // Enhanced Swagger UI configuration
    SwaggerModule.setup('docs', app, document, {
        explorer: true,
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            docExpansion: 'none', // Default closed for better performance with large APIs
            filter: true,
            showCommonExtensions: true,
            showExtensions: true,
            deepLinking: true, // Enables direct linking to operations
            syntaxHighlight: {
                theme: 'monokai'
            },
            tryItOutEnabled: true,
            defaultModelsExpandDepth: 1, // Limit initial expansion for performance
            defaultModelExpandDepth: 1,
            defaultModelRendering: 'model', // Options: 'model' or 'schema'
            displayOperationId: false,
            maxDisplayedTags: null,
            showOperationIds: false,
            tagsSorter: 'alpha', // Sort tags alphabetically
            operationsSorter: 'alpha', // Sort operations alphabetically
            supportedSubmitMethods: [
                'get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'
            ],
            jsonDocumentUrl: 'swagger/json',
            validatorUrl: null, // Disable validator (or use a custom one)
        },
        customSiteTitle: `${packageInfo.name} API Documentation`,
        customfavIcon: 'https://nestjs.com/img/favicon.png',
        customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .information-container { padding: 20px 0 }
            .swagger-ui .scheme-container { padding: 15px 0 }
            .swagger-ui .opblock-tag { font-size: 16px; margin: 10px 0 5px 0; }
            .swagger-ui .opblock-tag:hover { background-color: rgba(0,0,0,.05) }
            .swagger-ui section.models { margin-top: 20px }
            .swagger-ui .model-box { padding: 10px }
            .swagger-ui .response-col_description { font-size: 13px }
            .swagger-ui .markdown p { margin: 0 }
        `,
        customJs: `
            window.onload = function() {
                // Add custom JavaScript to enhance the Swagger UI experience
                setTimeout(() => {
                    // Add version badge
                    const title = document.querySelector('.swagger-ui .info .title');
                    if (title) {
                        const badge = document.createElement('span');
                        badge.style = 'background: #13aa52; color: white; font-size: 12px; padding: 2px 8px; border-radius: 12px; margin-left: 10px; vertical-align: middle;';
                        badge.innerText = '${nodeEnv.toUpperCase()}';
                        title.appendChild(badge);
                    }
                }, 100);
            }
        `,
    });
};