export const env = {
  PORT: process.env.PORT || '3000',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'system',
  DB_NAME: process.env.DB_NAME || 'lms_db',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
};