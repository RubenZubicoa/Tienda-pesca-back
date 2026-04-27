import winston from 'winston';

export const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log' }),
    ],
});

export function logError(error: Error, message: string) {
    logger.error(message, { error: error.message, stack: error.stack, timestamp: new Date().toISOString() });
}