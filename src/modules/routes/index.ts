import { Router } from 'express';
import authRoutes from '../auth/auth.routes';
import usuarioRoutes from '../usuarios/usuario.routes';
import promocionesRoutes from '../promociones/promociones.routes';
import actividadRoutes from '../actividad/actividad.routes';

console.log('🔥 Importando actividadRoutes...', actividadRoutes); // <-- AGREGAR

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/promociones', promocionesRoutes);
router.use('/actividad', actividadRoutes);

console.log('🔥 Rutas registradas: /actividad'); // <-- AGREGAR

export default router;