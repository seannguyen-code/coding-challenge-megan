interface Config {
  port: number;
  databaseUrl: string;
  nodeEnv: string;
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getEnvAsNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
};

export const config: Config = {
  port: getEnvAsNumber('PORT', 3000),
  databaseUrl: getEnv('DATABASE_URL'),
  nodeEnv: getEnv('NODE_ENV', 'development'),
};
