import jwt from 'jsonwebtoken'
import { envs } from '@config/envs'

// Qué información viaja dentro del token
interface TokenPayload {
  id: number
  email: string
}

export class JwtUtil {

  // Genera un token con la información del usuario, el token tiene un timepo de expiracion
  static generate(payload: TokenPayload): string {
    return jwt.sign(payload, envs.JWT_SECRET, {
      expiresIn: envs.JWT_EXPIRES_IN,
    })
  }

  // Verifica que el token sea válido y no haya expirado, si no es valido lanza una excepcion 
  static verify(token: string): TokenPayload {
    return jwt.verify(token, envs.JWT_SECRET) as TokenPayload
  }
}