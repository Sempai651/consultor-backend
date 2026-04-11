import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/AppError.util';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        cedula: string;
        rol: 'admin' | 'cliente';
      };
    }
  }
}

export const esAdmin = (req: Request, res: Response, next: NextFunction): void => {
  console.log('🔐 [esAdmin] Verificando rol...');
  console.log('🔐 [esAdmin] req.user:', req.user);
  
  if (!req.user) {
    console.log('❌ [esAdmin] No hay usuario autenticado');
    throw new AppError('No hay usuario autenticado', 401);
  }
  
  console.log('🔐 [esAdmin] Rol del usuario:', req.user.rol);
  
  if (req.user.rol !== 'admin') {
    console.log('❌ [esAdmin] Usuario no es admin');
    throw new AppError('Acceso denegado. Se requiere rol de administrador', 403);
  }
  
  console.log('✅ [esAdmin] Usuario es admin, permitido');
  next();
};