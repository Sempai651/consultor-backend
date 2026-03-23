import { Request, Response, NextFunction } from 'express'
import { JwtUtil } from '@utils/jwt.util'
import { ResponseUtil } from '@utils/response.util'
import { TokenBlacklist } from '@models/index'

declare global { namespace Express {interface Request {user?: { id: number; cedula: string }}}}


export const authMiddleware = async ( req: Request,res: Response,next: NextFunction): Promise<void> => {

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ResponseUtil.error(res, 'Token no proporcionado', 401)
    return
  }

  const token = authHeader.split(' ')[1]

  // Verificar que el token no esté en la blacklist
  const tokenInvalidado = await TokenBlacklist.findOne({ where: { token } })
  if (tokenInvalidado) {
    ResponseUtil.error(res, 'Sesión cerrada. Inicia sesión nuevamente', 401)
    return
  }

  const payload = JwtUtil.verify(token)
  req.user = payload
  next()
}