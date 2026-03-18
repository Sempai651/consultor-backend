import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '@config/database'

interface UsuarioAttributes {
    id: number
    nombre: string
    appellido: string
    email: string
    password: string
    activo: boolean
    tokenRecuperacion: string | null
    tokenExpiracion: Date | null
    createdAt?: Date
    updatedAt?: Date
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id' | 'tokenRecuperacion' | 'tokenExpiracion'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
implements UsuarioAttributes {
    public id!: number
    public nombre!:string
    public appellido!: string
    public email!: string
    public password!: string
    public activo!: boolean 
    public tokenRecuperacion!: string | null
    public tokenExpiracion!: Date | null
    public readonly createdAt!: Date
    public readonly updatedAt!: Date 
}

Usuario.init(
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey: true,
    },
   nombre: {
    type: DataTypes.STRING(100),
    allowNull:false,
   },
   appellido:{
    type: DataTypes.STRING(100),
    allowNull:false,
   },
   email:{
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate:{
        isEmail: true,
    },
   },
   password: {
    type: DataTypes.STRING(255),
    allowNull: false,
   },
   activo: {
    type: DataTypes.BOOLEAN,
    defaultValue:true,
   },
   tokenRecuperacion:{
    type: DataTypes.STRING(255),
    allowNull: true,
   },
   tokenExpiracion:{
    type: DataTypes.DATE,
    allowNull: true,
   },
   createdAt:{
    type: DataTypes.DATE,
    allowNull:true,
   },
},
{
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
}

)

export default Usuario



