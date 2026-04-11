import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '@utils/jwt.util';
import { ResponseUtil } from '@utils/response.util';
import { getPool } from '@config/database';
import { RowDataPacket } from 'mysql2';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; cedula: string; rol: 'admin' | 'cliente' };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  console.log('🔐 [authMiddleware] Authorization header:', authHeader ? '✅ Presente' : '❌ No presente');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ [authMiddleware] Token no proporcionado');
    ResponseUtil.error(res, 'Token no proporcionado', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 [authMiddleware] Token recibido (primeros 30 chars):', token.substring(0, 30) + '...');

  try {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM tokens_blacklist WHERE token = ?',
      [token]
    );

    if (rows.length > 0) {
      console.log('❌ [authMiddleware] Token en blacklist');
      ResponseUtil.error(res, 'Sesión cerrada. Inicia sesión nuevamente', 401);
      return;
    }

    const payload = JwtUtil.verify(token);
    console.log('🔐 [authMiddleware] Payload decodificado:', payload);
    
    const [userRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, cedula, rol FROM usuarios WHERE id = ?',
      [payload.id]
    );

    if (userRows.length === 0) {
      console.log('❌ [authMiddleware] Usuario no encontrado');
      ResponseUtil.error(res, 'Usuario no encontrado', 401);
      return;
    }

    const usuario = userRows[0];
    console.log('👤 [authMiddleware] Usuario autenticado:', { id: usuario.id, rol: usuario.rol });
    
    req.user = {
      id: usuario.id,
      cedula: usuario.cedula,
      rol: usuario.rol || 'cliente',
    };
    
    next();
  } catch (error) {
    console.error('❌ [authMiddleware] Error verificando token:', error);
    ResponseUtil.error(res, 'Token inválido o expirado', 401);
    return;
  }
};