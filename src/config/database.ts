import mysql from 'mysql2/promise';
import { envs } from './envs';

let pool: mysql.Pool | null = null;

export const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: envs.DB_HOST,
      port: envs.DB_PORT,
      user: envs.DB_USER,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
    });
    console.log('✅ Base de datos MySQL conectada');
    return pool;
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error);
    throw error;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Base de datos no conectada');
  }
  return pool;
};

export default { connectDB, getPool };