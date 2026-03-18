import dotenv from 'dotenv'
dotenv.config()

const getEnv = (key: string): string => {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Variable de entorno faltante: ${key}`)
    }
    return value
}
export const envs = {
    // Servidor por el momento 

    PORT: parseInt('DB_HOST'),
    NODE_ENV: getEnv('NODE_ENV'),

    //Base de datos
  DB_HOST: getEnv('DB_HOST'),
  DB_PORT: parseInt(getEnv('DB_PORT')),
  DB_NAME: getEnv('DB_NAME'),
  DB_USER: getEnv('DB_USER'),
  DB_PASSWORD: getEnv('DB_PASSWORD'),

  // JWT
   JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),

  // Email
  SMTP_HOST: getEnv('SMTP_HOST'),
  SMTP_PORT: parseInt(getEnv('SMTP_PORT')),
  SMTP_USER: getEnv('SMTP_USER'),
  SMTP_PASS: getEnv('SMTP_PASS'),
}
