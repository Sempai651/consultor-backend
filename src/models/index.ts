import { connectDB, getPool } from '@config/database';

export const initModels = async () => {
  await connectDB();
  console.log('✅ Modelos inicializados');
};

export { getPool };
export { UsuarioModel } from './usuario.model';
export { TokenBlacklistModel } from './tokenBlacklist.model';
export { PromocionModel } from './promocion.model';