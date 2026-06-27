/**
 * Application Configuration
 * All config values are hardcoded — no .env files required.
 */

module.exports = {
  PORT: 5000,
  JWT_SECRET: 'jeevansetu-hackathon-secret-key-2026-sama-social',
  JWT_EXPIRES_IN: '7d',
  DB_PATH: './database/jeevansetu.db',
  UPLOAD_DIR: './uploads',
  CORS_ORIGIN: 'http://localhost:5173',
};
