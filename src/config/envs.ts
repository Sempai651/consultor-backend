import dotenv from 'dotenv';

dotenv.config();

export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    console.warn(`⚠️ Variable ${key} no definida`);
    return '';
  }
  return value || defaultValue || '';
};

export const envs = {
  PORT: parseInt(getEnv('PORT', '3000')),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  JWT_SECRET: getEnv('JWT_SECRET', 'mi_clave_secreta_david_2025'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '24h'),

  // MySQL (sin Sequelize)
  DB_HOST: getEnv('DB_HOST', 'localhost'),
  DB_PORT: parseInt(getEnv('DB_PORT', '3306')),
  DB_USER: getEnv('DB_USER', 'root'),
  DB_PASSWORD: getEnv('DB_PASSWORD', ''),
  DB_NAME: getEnv('DB_NAME', 'consultor_db'),

  // SMTP
  SMTP_HOST: getEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(getEnv('SMTP_PORT', '587')),
  SMTP_USER: getEnv('SMTP_USER', ''),
  SMTP_PASS: getEnv('SMTP_PASS', ''),
};