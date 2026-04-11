import { Request, Response } from 'express';
import { PromocionModel } from '@models/promocion.model';
import { ResponseUtil } from '@utils/response.util';
import { AppError } from '@utils/AppError.util';

export class PromocionesController {
  // Obtener todas las promociones (AMBOS ROLES)
  async getAll(req: Request, res: Response): Promise<void> {
    const promociones = await PromocionModel.getAll();
    ResponseUtil.success(res, 'Promociones obtenidas', promociones);
  }

  // Obtener una sola promocion por su ID (AMBOS ROLES)
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const promocion = await PromocionModel.getById(Number(id));
    
    if (!promocion) {
      throw new AppError('Promoción no encontrada', 404);
    }
    
    ResponseUtil.success(res, 'Promoción obtenida', promocion);
  }

  // Crear una nueva promocion (SOLO ADMIN)
  async create(req: Request, res: Response): Promise<void> {
    const { titulo, categoria, descripcion, imagen, fecha_vencimiento } = req.body;
    
    console.log('📥 Datos recibidos en create:', { titulo, categoria, descripcion, fecha_vencimiento });
    
    if (!titulo || !categoria || !descripcion || !fecha_vencimiento) {
      throw new AppError('Todos los campos son requeridos', 400);
    }
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    let fechaVencimientoObj: Date;
    if (typeof fecha_vencimiento === 'string') {
      const [year, month, day] = fecha_vencimiento.split('-').map(Number);
      fechaVencimientoObj = new Date(year, month - 1, day);
    } else {
      fechaVencimientoObj = new Date(fecha_vencimiento);
    }
    fechaVencimientoObj.setHours(0, 0, 0, 0);
    
    console.log('📅 Hoy:', hoy);
    console.log('📅 Fecha vencimiento:', fechaVencimientoObj);
    
    if (fechaVencimientoObj < hoy) {
      throw new AppError('No se puede crear una promoción con fecha de vencimiento anterior a la fecha actual', 400);
    }
    
    const nuevaPromocion = await PromocionModel.create({
      titulo,
      categoria,
      descripcion,
      imagen: imagen || '',
      fecha_vencimiento: fecha_vencimiento,
    });
    
    ResponseUtil.success(res, 'Promoción creada exitosamente', nuevaPromocion, 201);
  }

  // Actualizar una promocion existente (SOLO ADMIN)
  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body;
    
    console.log('📥 Datos recibidos en update:', { id, ...data });
    
    const promocion = await PromocionModel.getById(Number(id));
    if (!promocion) {
      throw new AppError('Promoción no encontrada', 404);
    }
    
    if (data.fecha_vencimiento) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      let fechaVencimientoObj: Date;
      if (typeof data.fecha_vencimiento === 'string') {
        const [year, month, day] = data.fecha_vencimiento.split('-').map(Number);
        fechaVencimientoObj = new Date(year, month - 1, day);
      } else {
        fechaVencimientoObj = new Date(data.fecha_vencimiento);
      }
      fechaVencimientoObj.setHours(0, 0, 0, 0);
      
      if (fechaVencimientoObj < hoy) {
        throw new AppError('No se puede actualizar con fecha de vencimiento anterior a la actual', 400);
      }
    }
    
    const promocionActualizada = await PromocionModel.update(Number(id), data);
    ResponseUtil.success(res, 'Promoción actualizada', promocionActualizada);
  }

  // Eliminar una promocion (SOLO ADMIN)
  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    console.log('🗑️ [DELETE] ID recibido:', id);
    console.log('👤 [DELETE] Usuario:', req.user);
    
    const promocion = await PromocionModel.getById(Number(id));
    if (!promocion) {
      console.log('❌ [DELETE] Promoción no encontrada:', id);
      throw new AppError('Promoción no encontrada', 404);
    }
    
    console.log('✅ [DELETE] Promoción encontrada, eliminando...');
    const resultado = await PromocionModel.delete(Number(id));
    console.log('✅ [DELETE] Resultado:', resultado);
    ResponseUtil.success(res, 'Promoción eliminada exitosamente');
  }

  // Cambiar el estado de una promocion (activo/inactivo) (SOLO ADMIN)
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

  // ========== NUEVOS MÉTODOS PARA FILTROS (AMBOS ROLES) ==========

  async filtrar(req: Request, res: Response): Promise<void> {
    const { categoria, estado, fechaInicio, fechaFin } = req.query;
    
    const promociones = await PromocionModel.filtrar({
      categoria: categoria as string,
      estado: estado as string,
      fechaInicio: fechaInicio ? new Date(fechaInicio as string) : undefined,
      fechaFin: fechaFin ? new Date(fechaFin as string) : undefined
    });
    
    ResponseUtil.success(res, 'Filtro aplicado', promociones);
  }

  async buscarPorTitulo(req: Request, res: Response): Promise<void> {
    const { q } = req.query;
    
    if (!q || (q as string).trim() === '') {
      const promociones = await PromocionModel.getAll();
      ResponseUtil.success(res, 'Promociones obtenidas', promociones);
      return;
    }
    
    const promociones = await PromocionModel.buscarPorTitulo(q as string);
    ResponseUtil.success(res, 'Resultados de búsqueda', promociones);
  }

  async buscarPorCategoria(req: Request, res: Response): Promise<void> {
    const { categoria } = req.params;
    
    const promociones = await PromocionModel.buscarPorCategoria(categoria);
    ResponseUtil.success(res, `Promociones de categoría ${categoria}`, promociones);
  }

  async getActivas(req: Request, res: Response): Promise<void> {
    const promociones = await PromocionModel.getActivas();
    ResponseUtil.success(res, 'Promociones activas', promociones);
  }

  async getVencidas(req: Request, res: Response): Promise<void> {
    const promociones = await PromocionModel.getVencidas();
    ResponseUtil.success(res, 'Promociones vencidas', promociones);
  }
}