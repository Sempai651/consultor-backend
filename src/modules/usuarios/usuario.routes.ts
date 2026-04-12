import { Router } from 'express';
import { ActividadModel } from '../../models/actividad.model';
import { ResponseUtil } from '../../utils/response.util';
import { catchAsync } from '../../utils/catchAsync.util';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

console.log('🔥 Cargando rutas de actividad...'); // <-- AGREGAR ESTO

// Obtener actividades recientes
router.get('/reciente', authMiddleware, catchAsync(async (req, res) => {
  console.log('📡 Petición a /reciente recibida'); // <-- AGREGAR ESTO
  const actividades = await ActividadModel.getRecientes();
  ResponseUtil.success(res, 'Actividades obtenidas', actividades);
}));

// Registrar actividad
router.post('/', authMiddleware, catchAsync(async (req, res) => {
  const { tipo, titulo, descripcion, icono, color } = req.body;
  
  const actividad = await ActividadModel.create({
    tipo,
    titulo,
    descripcion,
    icono: icono || 'bell',
    color: color || '#6B7280',
  });
  
  ResponseUtil.success(res, 'Actividad registrada', actividad, 201);
}));

export default router;