import { Request, Response } from 'express';
import { ActividadModel } from '@models/actividad.model';
import { ResponseUtil } from '@utils/response.util';

export class ActividadController {
  // Registrar una nueva actividad
  async create(req: Request, res: Response): Promise<void> {
    const { tipo, titulo, descripcion, icono, color } = req.body;
    
    const actividad = await ActividadModel.create({
      tipo,
      titulo,
      descripcion,
      icono: icono || 'bell',
      color: color || '#6B7280',
    });
    
    ResponseUtil.success(res, 'Actividad registrada', actividad, 201);
  }

  // Obtener actividades recientes
  async getRecientes(req: Request, res: Response): Promise<void> {
    const actividades = await ActividadModel.getRecientes();
    ResponseUtil.success(res, 'Actividades obtenidas', actividades);
  }
}