import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { ResponseUtil } from '@utils/response.util'
import {
  validateRegister,
  validateLogin,
  validateRecuperarClave,
} from './auth.dto'

const authService = new AuthService()

export class AuthController {

  async register(req: Request, res: Response): Promise<void> {
    const error = validateRegister(req.body)
    if (error) {
      ResponseUtil.error(res, error, 400)
      return
    }

    const result = await authService.register(req.body)
    ResponseUtil.success(res, 'Usuario registrado exitosamente', result, 201)
  }

  async login(req: Request, res: Response): Promise<void> {
    const error = validateLogin(req.body)
    if (error) {
      ResponseUtil.error(res, error, 400)
      return
    }

    const result = await authService.login(req.body)
    ResponseUtil.success(res, 'Login exitoso', result)
  }

  async recuperarClave(req: Request, res: Response): Promise<void> {
    const error = validateRecuperarClave(req.body)
    if (error) {
      ResponseUtil.error(res, error, 400)
      return
    }

    await authService.recuperarClave(req.body.email)
    ResponseUtil.success(res, 'Si el email existe, recibirás un enlace de recuperación')
  }

  async logout(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization!.split(' ')[1]
    await authService.logout(token)
    ResponseUtil.success(res, 'Sesión cerrada exitosamente')
  }

  async nuevaClave(req: Request, res: Response): Promise<void> {
    const { token } = req.params
    const { password } = req.body

    if (!password || password.length < 6) {
      ResponseUtil.error(res, 'La contraseña debe tener al menos 6 caracteres', 400)
      return
    }

    await authService.nuevaClave(token, password)
    ResponseUtil.success(res, 'Contraseña actualizada exitosamente')
  }
}