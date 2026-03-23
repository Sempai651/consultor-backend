
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '@config/database'

interface TokenBlacklistAttributes {
  id: number
  token: string
  expiracion: Date
  createdAt?: Date
}

interface TokenBlacklistCreationAttributes
  extends Optional<TokenBlacklistAttributes, 'id'> {}

class TokenBlacklist extends Model<TokenBlacklistAttributes, TokenBlacklistCreationAttributes>
  implements TokenBlacklistAttributes {
  public id!: number
  public token!: string
  public expiracion!: Date
  public readonly createdAt!: Date
}

TokenBlacklist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.TEXT,     
      allowNull: false,
      unique: true,
    },
    expiracion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tokens_blacklist',
    timestamps: true,
    updatedAt: false,           
  }
)

export default TokenBlacklist