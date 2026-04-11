import { connectDB, getPool } from '@config/database';

export const initModels = async () => {
  await connectDB();
  console.log('✅ Modelos inicializados'); // Mensaje de confirmacion
};
// Exportamos la funcion getPool para que otros archivos puedan ejecutar consultas SQL
export { getPool };
// Exportamos todos los modelos para usarlos en los controladores y servicios
export { UsuarioModel } from './usuario.model';
export { TokenBlacklistModel } from './tokenBlacklist.model';
export { PromocionModel } from './promocion.model';
export { FuncionModel } from './funcion.model';