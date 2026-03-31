import { Router } from 'express';
import { PromocionesController } from './promociones.controller';
import { catchAsync } from '@utils/catchAsync.util';
import { authMiddleware } from '@middlewares/auth.middleware';

const router = Router();
const promocionesController = new PromocionesController();

router.get('/', authMiddleware, catchAsync(promocionesController.getAll.bind(promocionesController)));
router.get('/:id', authMiddleware, catchAsync(promocionesController.getById.bind(promocionesController)));
router.post('/', authMiddleware, catchAsync(promocionesController.create.bind(promocionesController)));
router.put('/:id', authMiddleware, catchAsync(promocionesController.update.bind(promocionesController)));
router.delete('/:id', authMiddleware, catchAsync(promocionesController.delete.bind(promocionesController)));
router.patch('/:id/estado', authMiddleware, catchAsync(promocionesController.toggleEstado.bind(promocionesController)));

export default router;