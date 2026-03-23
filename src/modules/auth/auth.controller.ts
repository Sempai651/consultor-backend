
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
    // 1. Validar los datos de entrada
    const error = validateRegister(req.body)
    if (error) {
      ResponseUtil.error(res, error, 400)
      return
    }

    //  Llamar al service
    const result = await authService.register(req.body)

    // Responder
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

    // Mismo mensaje siempre — no revelamos si el email existe
    ResponseUtil.success(
      res,
      'Si el email existe, recibirás un enlace de recuperación'
    )
  }
  async logout(req: Request, res: Response): Promise<void> {
  // El token viene del header Authorization
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
  async restablecerClaveWeb(req: Request, res: Response): Promise<void> {
  const { token } = req.params

  // Devuelve un formulario HTML simple
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablecer Contraseña - Consultor App</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: Arial, sans-serif; 
          background: #f0f4ff; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh;
          padding: 20px;
        }
        .card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        h2 { color: #2A4494; margin-bottom: 10px; }
        p { color: #666; margin-bottom: 24px; font-size: 14px; }
        input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          margin-bottom: 16px;
          outline: none;
        }
        input:focus { border-color: #2A4494; }
        button {
          width: 100%;
          padding: 14px;
          background: #2A4494;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          font-weight: bold;
        }
        button:hover { background: #1a3070; }
        .mensaje { 
          margin-top: 16px; 
          padding: 12px; 
          border-radius: 8px; 
          text-align: center;
          display: none;
        }
        .exito { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Nueva contraseña</h2>
        <p>Ingresa tu nueva contraseña para completar el proceso.</p>
        
        <input 
          type="password" 
          id="password" 
          placeholder="Nueva contraseña (mínimo 6 caracteres)" 
        />
        <input 
          type="password" 
          id="confirmPassword" 
          placeholder="Confirmar contraseña" 
        />
        <button onclick="cambiarClave()">ACTUALIZAR CONTRASEÑA</button>
        
        <div id="mensaje" class="mensaje"></div>
      </div>

      <script>
        async function cambiarClave() {
          const password = document.getElementById('password').value
          const confirm = document.getElementById('confirmPassword').value
          const mensaje = document.getElementById('mensaje')

          if (!password || password.length < 6) {
            mostrarMensaje('La contraseña debe tener al menos 6 caracteres', false)
            return
          }

          if (password !== confirm) {
            mostrarMensaje('Las contraseñas no coinciden', false)
            return
          }

          try {
            const response = await fetch('/api/auth/nueva-clave/${token}', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password })
            })

            const data = await response.json()

            if (data.success) {
              mostrarMensaje('✅ Contraseña actualizada exitosamente. Ya puedes iniciar sesión en la app.', true)
            } else {
              mostrarMensaje(data.message || 'Error al actualizar', false)
            }
          } catch (error) {
            mostrarMensaje('Error de conexión', false)
          }
        }

        function mostrarMensaje(texto, exito) {
          const el = document.getElementById('mensaje')
          el.textContent = texto
          el.className = 'mensaje ' + (exito ? 'exito' : 'error')
          el.style.display = 'block'
        }
      </script>
    </body>
    </html>
  `)
}

}