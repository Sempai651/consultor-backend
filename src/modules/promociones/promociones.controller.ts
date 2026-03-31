import { Request, Response } from 'express';
import { PromocionModel } from '@models/promocion.model';
import { ResponseUtil } from '@utils/response.util';
import { AppError } from '@utils/AppError.util';

export class PromocionesController {
  async getAll(req: Request, res: Response): Promise<void> {
    const promociones = await PromocionModel.getAll();
    ResponseUtil.success(res, 'Promociones obtenidas', promociones);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const promocion = await PromocionModel.getById(Number(id));
    
    if (!promocion) {
      throw new AppError('Promoción no encontrada', 404);
    }
    
    ResponseUtil.success(res, 'Promoción obtenida', promocion);
  }

  async create(req: Request, res: Response): Promise<void> {
    const { titulo, categoria, descripcion, imagen, fecha_vencimiento } = req.body;
    
    if (!titulo || !categoria || !descripcion || !fecha_vencimiento) {
      throw new AppError('Todos los campos son requeridos', 400);
    }
    
    const nuevaPromocion = await PromocionModel.create({
      titulo,
      categoria,
      descripcion,
      imagen: imagen || '',
      fecha_vencimiento,
    });
    
    ResponseUtil.success(res, 'Promoción creada exitosamente', nuevaPromocion, 201);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body;
    
    const promocion = await PromocionModel.getById(Number(id));
    if (!promocion) {
      throw new AppError('Promoción no encontrada', 404);
    }
    
    const promocionActualizada = await PromocionModel.update(Number(id), data);
    ResponseUtil.success(res, 'Promoción actualizada', promocionActualizada);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const promocion = await PromocionModel.getById(Number(id));
    if (!promocion) {
      throw new AppError('Promoción no encontrada', 404);
    }
    
    await PromocionModel.delete(Number(id));
    ResponseUtil.success(res, 'Promoción eliminada exitosamente');
  }

  async toggleEstado(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!estado || !['activo', 'inactivo'].includes(estado)) {
      throw new AppError('Estado inválido. Debe ser "activo" o "inactivo"', 400);
    }
    
    const promocion = await PromocionModel.getById(Number(id));
    if (!promocion) {
      throw new AppError('Promoción no encontrada', 404);
    }
    
    const promocionActualizada = await PromocionModel.toggleEstado(Number(id), estado);
    ResponseUtil.success(res, `Promoción ${estado === 'activo' ? 'activada' : 'desactivada'}`, promocionActualizada);
  }
}