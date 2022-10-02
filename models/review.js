'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id'
      });

      Review.belongsTo(models.Evtarget, {
        foreignKey: 'evtargetId',
        targetKey: 'id'
      });
    }
  }
  Review.init({
    //userId: DataTypes.INTEGER,
    //evtargetId: DataTypes.INTEGER,
    comment: {
      type: DataTypes.STRING,
      validate: {
        len: {
          msg: "コメントは100文字以内で入力してください。",
          args: [0, 100]
        }
      }
    },
    star: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "星は半角数字で入力してください。"
        },
        notEmpty: {
          msg: "星は必須です。半角数字で入力してください。"
        },
        max: {
          msg: "星は1~5で入力してください。",
          args: [5]
        },
        min: {
          msg: "星は1~5で入力してください。",
          args: [1]
        }
      }
    },
    purchasedate: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "購入日は必須です。"
        },
        isDate: {
          msg: "カレンダーから選択してください。"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};