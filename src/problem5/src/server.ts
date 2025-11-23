import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from './config/env';
import { logger, appLogger } from './middleware/logger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import resourceRoutes from './routes/resourceRoutes';

// Initialize Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(logger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/resources', resourceRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Error handler - must be last
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection with Prisma
    const prisma = (await import('./db/client')).default;
    await prisma.$connect();
    appLogger.info('Database connection successful');

    app.listen(config.port, () => {
      appLogger.info(`Server is running on port ${config.port}`);
      appLogger.info(`Environment: ${config.nodeEnv}`);
      appLogger.info(
        `Health check available at http://localhost:${config.port}/health`
      );
    });
  } catch (error) {
    appLogger.error('Failed to start server', { error });
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  appLogger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  appLogger.error('Uncaught Exception', { error });
  process.exit(1);
});

// Start the server
startServer();
