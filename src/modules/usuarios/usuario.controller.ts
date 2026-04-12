import { Request, Response } from 'express';
import { UsuarioModel } from '@models/usuario.model';
import { ResponseUtil } from '@utils/response.util';
import { AppError } from '@utils/AppError.util';

export class UsuarioController {
  // Obtener todos los usuarios (solo admin)
  async getAll(req: Request, res: Response): Promise<void> {
    const usuarios = await UsuarioModel.findAll();
    // Ocultar contraseñas
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    ResponseUtil.success(res, 'Usuarios obtenidos', usuariosSinPassword);
  }

  // Obtener usuario por ID
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const usuario = await UsuarioModel.findById(Number(id));
    
    if (!usuario) {
      throw new AppError('Usuario no encontrada', 404);
    }
    
    // Ocultar contraseña
    const { password, ...usuarioSinPassword } = usuario;
    ResponseUtil.success(res, 'Usuario obtenido', usuarioSinPassword);
  }

  // Actualizar usuario
  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nombre, apellido, email, rol, activo } = req.body;
    
    const usuario = await UsuarioModel.findById(Number(id));
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }
    
    const data: any = {};
    if (nombre) data.nombre = nombre;
    if (apellido) data.apellido = apellido;
    if (email) data.email = email;
    if (rol) data.rol = rol;
    if (activo !== undefined) data.activo = activo;
    
    const usuarioActualizado = await UsuarioModel.update(Number(id), data);
    const { password, ...usuarioSinPassword } = usuarioActualizado!;
    ResponseUtil.success(res, 'Usuario actualizado', usuarioSinPassword);
  }

  // Eliminar usuario (solo admin)
  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const usuario = await UsuarioModel.findById(Number(id));
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }
    
    await UsuarioModel.delete(Number(id));
    ResponseUtil.success(res, 'Usuario eliminado exitosamente');
  }
}