// Global test setup
// This file runs before all tests
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env' });

// Use test database if DATABASE_URL_TEST is set
if (process.env.DATABASE_URL_TEST) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
}
