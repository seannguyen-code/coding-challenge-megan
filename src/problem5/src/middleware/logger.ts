import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

interface LoggerOptions {
  name: string;
  logDir: string;
  level?: string;
  enableConsole?: boolean;
  maxSize?: string;
  maxFiles?: string;
  format?: string;
}

/**
 * Set up a Winston logger with the given configuration.
 *
 * @param name - Name of the logger (used in log metadata).
 * @param logDir - Directory path for log files.
 * @param level - Logging level (default: 'info').
 * @param enableConsole - Whether to also output logs to the console (default: true).
 * @param maxSize - Maximum size of the log file before rotation (default: '10m').
 * @param maxFiles - Number of days or files to keep (default: '5d').
 * @param format - Format string for log messages (default: timestamp + level + message).
 * @returns Configured Winston logger instance.
 */
export function setupLogger({
  name,
  logDir,
  level = 'info',
  enableConsole = true,
  maxSize = '10m',
  maxFiles = '5d',
  format: formatStr,
}: LoggerOptions): winston.Logger {
  if (!name) {
    throw new Error('Logger name must be a non-empty string.');
  }
  if (!logDir) {
    throw new Error('Log directory path must be a non-empty string.');
  }

  // Create log directory if it doesn't exist
  const absoluteLogDir = path.resolve(logDir);
  if (!fs.existsSync(absoluteLogDir)) {
    fs.mkdirSync(absoluteLogDir, { recursive: true });
  }

  // Define log format
  const logFormat = formatStr
    ? winston.format.printf((info: any) =>
        formatStr.replace(/%\((\w+)\)s/g, (_, key) => info[key] || '')
      )
    : winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(
          ({ timestamp, level, message, name: logName, ...meta }: any) => {
            const metaStr = Object.keys(meta).length
              ? ` ${JSON.stringify(meta)}`
              : '';
            return `${timestamp} - ${logName || name} - ${level.toUpperCase()} - ${message}${metaStr}`;
          }
        )
      );

  const transports: winston.transport[] = [];

  // File transport with rotation
  transports.push(
    new DailyRotateFile({
      filename: path.join(absoluteLogDir, '%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize,
      maxFiles,
      level,
      format: logFormat,
    })
  );

  // Console transport (optional)
  if (enableConsole) {
    transports.push(
      new winston.transports.Console({
        level,
        format: winston.format.combine(winston.format.colorize(), logFormat),
      })
    );
  }

  // Create logger
  return winston.createLogger({
    level,
    defaultMeta: { name },
    transports,
    exitOnError: false,
  });
}

// Create default application logger
const logDir = path.join(process.cwd(), 'logs');
export const appLogger = setupLogger({
  name: 'app',
  logDir,
  level: process.env.LOG_LEVEL || 'info',
  enableConsole: process.env.NODE_ENV !== 'production',
});

/**
 * Express middleware for logging HTTP requests and responses.
 */
export const logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 500) {
      appLogger.error('HTTP Request Error', logData);
    } else if (res.statusCode >= 400) {
      appLogger.warn('HTTP Request Warning', logData);
    } else {
      appLogger.info('HTTP Request', logData);
    }
  });

  next();
};
