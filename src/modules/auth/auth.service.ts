import crypto from 'crypto'
import { Usuario } from '@models/index'
import { BcryptUtil } from '@utils/bcryp.tutil'
import { JwtUtil } from '@utils/jwt.util'
import { AuthResponse, RegisterDto, LoginDto } from '@interfaces/usuario.interface'
import transporter from '@config/mailer'
import { envs } from '@config/envs'
import { AppError } from '@utils/AppError.util'

export class AuthService {

  //  REGISTRO 
  async register(data: RegisterDto): Promise<AuthResponse> {

    const existeCedula = await Usuario.findOne({ where: { cedula: data.cedula } })
    if (existeCedula) throw new AppError('La cédula ya está registrada', 400)

    const existeEmail = await Usuario.findOne({ where: { email: data.email } })
    if (existeEmail) throw new AppError('El email ya está registrado', 400)

    const passwordHash = await BcryptUtil.hash(data.password)

    const usuario = await Usuario.create({
      nombre: data.nombre,
      apellido: data.apellido,
      cedula: data.cedula,
      email: data.email,
      password: passwordHash,
    })

    
    const token = JwtUtil.generate({ id: usuario.id, cedula: usuario.cedula })

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        email: usuario.email,
      },
    }
  }

  //LOGIN
  async login(data: LoginDto): Promise<AuthResponse> {

    const usuario = await Usuario.findOne({ where: { cedula: data.cedula } })
    if (!usuario) throw new AppError('Credenciales incorrectas', 401)

    if (!usuario.activo) throw new AppError('Cuenta desactivada', 401)

    const passwordValida = await BcryptUtil.compare(data.password, usuario.password)
    if (!passwordValida) throw new AppError('Credenciales incorrectas', 401)

    // ← CORREGIDO: usuario.cedula no usuario.email
    const token = JwtUtil.generate({ id: usuario.id, cedula: usuario.cedula })

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        email: usuario.email,
      },
    }
  }

  // RECUPERAR CLAVE 
  async recuperarClave(email: string): Promise<void> {

    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) return

    const token = crypto.randomBytes(32).toString('hex')

    const expiracion = new Date()
    expiracion.setHours(expiracion.getHours() + 1)

    await usuario.update({
      tokenRecuperacion: token,
      tokenExpiracion: expiracion,
    })

    await transporter.sendMail({
      from: `"Consultor App" <${envs.SMTP_USER}>`,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2A4494;">Recuperar contraseña</h2>
          <p>Haz clic en el siguiente botón para recuperar tu contraseña:</p>
          <a 
            href="http://localhost:3000/api/auth/restablecer-clave-web/${token}"
            style="background-color: #2A4494; color: white; padding: 12px 24px; 
                   text-decoration: none; border-radius: 8px; display: inline-block;"
          >
            Recuperar contraseña
          </a>
          <p style="color: #666; margin-top: 20px;">
            Este enlace vence en <strong>1 hora</strong>.
          </p>
          <p style="color: #999; font-size: 12px;">
            Si no solicitaste este cambio, ignora este mensaje.
          </p>
        </div>
      `,
    })
  }

  //  NUEVA CLAVE 
  async nuevaClave(token: string, nuevaPassword: string): Promise<void> {

    const usuario = await Usuario.findOne({
      where: { tokenRecuperacion: token },
    })

    if (!usuario) throw new AppError('Token inválido', 400)

    const ahora = new Date()
    if (!usuario.tokenExpiracion || usuario.tokenExpiracion < ahora) {
      throw new AppError('El token ha expirado', 400)
    }

    const passwordHash = await BcryptUtil.hash(nuevaPassword)

    await usuario.update({
      password: passwordHash,
      tokenRecuperacion: null,
      tokenExpiracion: null,
    })
  }
}