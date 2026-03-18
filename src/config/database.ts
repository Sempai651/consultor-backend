
import { Sequelize } from 'sequelize';
import { envs } from  '@config/envs';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: envs.DB_HOST,   
    port: envs.DB_PORT,
    database: envs.DB_NAME,
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    logging: envs.NODE_ENV === 'development'
    ? (sql) => console.log(`\n[SQL] ${sql}\n`)
    : false,
})
//Verificamos la conexion

export const connectDB = async (): Promise<void> => {
    await sequelize.authenticate()
    console.log('Conexion a PostgreSQL exitosa')
}

export default sequelize