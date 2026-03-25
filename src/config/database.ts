import { Sequelize } from 'sequelize';
import { envs } from './envs';

const sequelize = new Sequelize({
  dialect: envs.DB_DIALECT as any,
  storage: envs.DB_STORAGE,
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('📦 Base de datos SQLite conectada');
    await sequelize.sync({ alter: true });
    console.log('📦 Modelos sincronizados');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    throw error;
  }
};

export default sequelize;