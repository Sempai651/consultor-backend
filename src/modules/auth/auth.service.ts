import crypto from 'crypto';
import { UsuarioModel } from '@models/usuario.model';
import { TokenBlacklistModel } from '@models/tokenBlacklist.model';
import { BcryptUtil } from '@utils/bcryp.tutil';
import { JwtUtil } from '@utils/jwt.util';
import { AuthResponse, RegisterDto, LoginDto } from '@interfaces/usuario.interface';
import transporter from '@config/mailer';
import { envs } from '@config/envs';
import { AppError } from '@utils/AppError.util';

export class AuthService {

  async register(data: RegisterDto): Promise<AuthResponse> {
    // Verificar si la cédula ya existe
    const existeCedula = await UsuarioModel.findByCedula(data.cedula);
    if (existeCedula) throw new AppError('La cédula ya está registrada', 400);

    // Verificar si el email ya existe
    const existeEmail = await UsuarioModel.findByEmail(data.email);
    if (existeEmail) throw new AppError('El email ya está registrado', 400);

    // Encriptar contraseña
    const passwordHash = await BcryptUtil.hash(data.password);

    // Crear usuario
    const usuario = await UsuarioModel.create({
      nombre: data.nombre,
      apellido: data.apellido,
      cedula: data.cedula,
      email: data.email,
      password: passwordHash,
    });

    if (!usuario) throw new AppError('Error al crear usuario', 500);

    // Generar token JWT
    const token = JwtUtil.generate({ id: usuario.id, cedula: usuario.cedula });

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        email: usuario.email,
      },
    };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    // Buscar usuario por cédula
    const usuario = await UsuarioModel.findByCedula(data.cedula);
    if (!usuario) throw new AppError('Credenciales incorrectas', 401);

    // Verificar si está activo
    if (usuario.activo === 0) throw new AppError('Cuenta desactivada', 401);

    // Verificar contraseña
    const passwordValida = await BcryptUtil.compare(data.password, usuario.password);
    if (!passwordValida) throw new AppError('Credenciales incorrectas', 401);

    // Generar token
    const token = JwtUtil.generate({ id: usuario.id, cedula: usuario.cedula });

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        email: usuario.email,
      },
    };
  }

  async recuperarClave(email: string): Promise<void> {
    const usuario = await UsuarioModel.findByEmail(email);
    if (!usuario) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    // Actualizar usuario con token de recuperación
    await UsuarioModel.update(usuario.id, {
      tokenRecuperacion: token,
      tokenExpiracion: expiracion,
    });

    const enlace = `http://localhost:3000/recuperar.html?token=${token}`;
    console.log('\n========== ENLACE DE RECUPERACIÓN ==========');
    console.log(enlace);
    console.log('=============================================\n');

    try {
      await transporter.sendMail({
        from: `"Consultor App" <${envs.SMTP_USER}>`,
        to: email,
        subject: 'Recuperación de contraseña',
        html: `<a href="${enlace}">Recuperar contraseña</a>`,
      });
      console.log('Correo enviado correctamente');
    } catch (error: any) {
      console.error('Error al enviar correo:', error?.message || error);
    }
  }

  async nuevaClave(token: string, nuevaPassword: string): Promise<void> {
    const usuario = await UsuarioModel.findByToken(token);
    if (!usuario) throw new AppError('Token inválido', 400);

    const ahora = new Date();
    const expiracionDate = usuario.tokenExpiracion ? new Date(usuario.tokenExpiracion) : null;
    
    if (!expiracionDate || expiracionDate < ahora) {
      throw new AppError('El token ha expirado', 400);
    }

    const passwordHash = await BcryptUtil.hash(nuevaPassword);
    await UsuarioModel.update(usuario.id, {
      password: passwordHash,
      tokenRecuperacion: null,
      tokenExpiracion: null,
    });
  }

  async logout(token: string): Promise<void> {
    const payload = JwtUtil.verify(token);
    const expiracion = new Date((payload as any).exp * 1000);
    await TokenBlacklistModel.create({ token, expiracion });
  }
}