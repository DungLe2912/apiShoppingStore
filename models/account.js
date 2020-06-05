const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Account extends Model {}
  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        defaultValue: null,
        unique:true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: null,
        validate: {
          isEmail: true,
        },
        unique:true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: 'is_deleted',
      },
    },
    {
      modelName: 'Account',
      tableName: 'account',
      sequelize,
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    },
  );
  return Account;
};
