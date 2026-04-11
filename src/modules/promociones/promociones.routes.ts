import { Router } from 'express';
import { PromocionesController } from './promociones.controller';
import { catchAsync } from '@utils/catchAsync.util';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { esAdmin } from '../../middlewares/rol.middleware';

const router = Router();
const promocionesController = new PromocionesController();

// ========== RUTAS PARA AMBOS ROLES ==========
router.get('/', authMiddleware, catchAsync(promocionesController.getAll.bind(promocionesController)));
router.get('/:id', authMiddleware, catchAsync(promocionesController.getById.bind(promocionesController)));

// ========== RUTAS DE FILTROS ==========
router.get('/filtros/aplicar', authMiddleware, catchAsync(promocionesController.filtrar.bind(promocionesController)));
router.get('/filtros/buscar', authMiddleware, catchAsync(promocionesController.buscarPorTitulo.bind(promocionesController)));
router.get('/categoria/:categoria', authMiddleware, catchAsync(promocionesController.buscarPorCategoria.bind(promocionesController)));
router.get('/estado/activas', authMiddleware, catchAsync(promocionesController.getActivas.bind(promocionesController)));
router.get('/estado/vencidas', authMiddleware, catchAsync(promocionesController.getVencidas.bind(promocionesController)));

// ========== RUTAS SOLO PARA ADMIN ==========
router.post('/', authMiddleware, esAdmin, catchAsync(promocionesController.create.bind(promocionesController)));
router.put('/:id', authMiddleware, esAdmin, catchAsync(promocionesController.update.bind(promocionesController)));
router.delete('/:id', authMiddleware, esAdmin, catchAsync(promocionesController.delete.bind(promocionesController)));
router.patch('/:id/estado', authMiddleware, esAdmin, catchAsync(promocionesController.toggleEstado.bind(promocionesController)));

export default router;