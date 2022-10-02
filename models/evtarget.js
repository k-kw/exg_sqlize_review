'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evtarget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Evtarget.hasMany(models.Review, {
        foreignKey: 'evtargetId',
        sourceKey: 'id'
      });
    }
  }
  Evtarget.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '製品名は必須です。'
        },
        len: {
          msg: "製品名は1~500文字で入力してください。",
          args: [1, 500]
        }
      }
    },
    manufac: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '製造社は必須です。'
        },
        len: {
          msg: "製造社は1~500文字で入力してください。",
          args: [1, 500]
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Evtarget',
  });
  return Evtarget;
};