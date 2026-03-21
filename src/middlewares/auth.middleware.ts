
import { Request, Response, NextFunction } from 'express'
import { JwtUtil } from '@utils/jwt.util'
import { ResponseUtil } from '@utils/response.util'

// Extendemos Request de Express para agregar el usuario autenticado

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; cedula: string }
    }
  }
}

export const authMiddleware = (req: Request,res: Response,next: NextFunction): void => {

  // El token viaja en el header 
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ResponseUtil.error(res, 'Token no proporcionado', 401)
    return
  }

  const token = authHeader.split(' ')[1]

  // Verifica si el token es valido o ya expiro 
  const payload = JwtUtil.verify(token)
  req.user = payload  
  next()              
}