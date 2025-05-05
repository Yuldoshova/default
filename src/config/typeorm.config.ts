import { ConfigModule, ConfigService } from "@nestjs/config";
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from "@nestjs/typeorm";

/**
 * TypeORM configuration for NestJS module
 * Uses ConfigService to load database settings from environment
 */
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService,
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            database: configService.get<string>('DB_NAME'),
            password: configService.get<string>('DB_PASSWORD'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get<string>('NODE_ENV') === 'development',
            logging: configService.get<string>('NODE_ENV') === 'development',
        };
    },
};
