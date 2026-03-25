import dotenv from 'dotenv';

dotenv.config();

export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    console.warn(`⚠️ Variable ${key} no definida, usando valor por defecto`);
    return '';
  }
  return value || defaultValue || '';
};

export const envs = {
  PORT: parseInt(getEnv('PORT', '3000')),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  JWT_SECRET: getEnv('JWT_SECRET', 'mi_clave_secreta_david_2025'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '24h'),

  // SQLite
  DB_DIALECT: getEnv('DB_DIALECT', 'sqlite'),
  DB_STORAGE: getEnv('DB_STORAGE', './database.sqlite'),

  // SMTP
  SMTP_HOST: getEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(getEnv('SMTP_PORT', '587')),
  SMTP_USER: getEnv('SMTP_USER', 'dm5447566@gmail.com'),
  SMTP_PASS: getEnv('SMTP_PASS', 'Men2002@20'),
};

export const env = envs;