const { Model, DataTypes, Deferrable } = require('sequelize');
const Account = require('./account');

module.exports = (sequelize) => {
  class INFOR_USER extends Model {}
  INFOR_USER.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userID: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
          model: Account(sequelize),
          key: 'id',
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      dob: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      gender: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
    },
    {
      modelName: 'INFOR_USER',
      tableName: 'infor_user',
      sequelize,
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    },
  );
  return INFOR_USER;
};
