import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '@config/database'

interface FuncionAttributes {
    id: number
    titulo: string
    descripcion: string 
    imagen: string
    categoria: string
    activo: boolean
    createdAt?: Date
    updatedAt?: Date
}
interface FuncionCreationAttributes extends Optional<FuncionAttributes, 'id'> {} 
class Funcion extends Model<FuncionAttributes, FuncionCreationAttributes>

implements FuncionAttributes {
  public id!: number
  public titulo!: string
  public descripcion!: string
  public imagen!: string
  public categoria!: string
  public activo!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Funcion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,       
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING(500), 
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'funciones',
    timestamps: true,
  }
)

export default Funcion