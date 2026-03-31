import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '@utils/jwt.util';
import { ResponseUtil } from '@utils/response.util';
import { getPool } from '@config/database';
import { RowDataPacket } from 'mysql2';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; cedula: string };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ResponseUtil.error(res, 'Token no proporcionado', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar que el token no esté en la blacklist
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM tokens_blacklist WHERE token = ?',
      [token]
    );

    if (rows.length > 0) {
      ResponseUtil.error(res, 'Sesión cerrada. Inicia sesión nuevamente', 401);
      return;
    }

    // Verificar token JWT
    const payload = JwtUtil.verify(token);
    req.user = payload;
    next();
  } catch (error) {
    ResponseUtil.error(res, 'Token inválido o expirado', 401);
    return;
  }
};