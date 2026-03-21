import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '@config/database'

interface UsuarioAttributes {
    id: number
    nombre: string
    apellido: string
    cedula: string
    email: string
    password: string
    activo: boolean
    tokenRecuperacion: string | null
    tokenExpiracion: Date | null
    createdAt?: Date
    updatedAt?: Date
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 
    'id' | 'activo' | 'tokenRecuperacion' | 'tokenExpiracion'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
    implements UsuarioAttributes {
    public id!: number
    public nombre!: string
    public apellido!: string
    public cedula!: string
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
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        cedula: {
            type: DataTypes.STRING(10),     
            allowNull: false,
            unique: true,                   
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        tokenRecuperacion: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        tokenExpiracion: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        timestamps: true,   
    }
)

export default Usuario



