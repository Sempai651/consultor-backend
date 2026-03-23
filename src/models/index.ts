import sequelize from "@config/database";
import Usuario from "./usuario.model";
import Funcion from "./funcion.model";
import TokenBlacklist from "./tokenBlacklist.model";


//Comparamos los campos de las tablas existentes y si hay cambios aplicamos los cambios sin borrar datos 
const syncModels = async (): Promise<void> => {
    await sequelize.sync ({alter: true})
    console.log('Modelos sincronizados con la base de datos')
} 
export {Usuario, Funcion, TokenBlacklist, syncModels}