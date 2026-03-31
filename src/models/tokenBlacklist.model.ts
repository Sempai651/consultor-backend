import { getPool } from '@config/database';
import { OkPacket } from 'mysql2';

export const TokenBlacklistModel = {
  create: async (data: { token: string; expiracion: Date }) => {
    const pool = getPool();
    await pool.execute<OkPacket>(
      'INSERT INTO tokens_blacklist (token, expiracion) VALUES (?, ?)',
      [data.token, data.expiracion]
    );
  },
};