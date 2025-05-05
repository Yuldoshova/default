export const appConfig = () => ({
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_PORT: parseInt(process.env.APP_PORT || '8080', 10) || 8080,
    APP_HOST: process.env.APP_HOST || 'localhost',
    DB_ENABLED: process.env.DB_ENABLED === 'true'
})