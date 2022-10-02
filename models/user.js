'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        sourceKey: 'id'
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "ユーザ名は必須です。"
        },
        len: {
          msg: "ユーザ名は2~100文字で入力してください。",
          args: [2, 100]
        }
      }
    },
    mail: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "メールアドレスは必須です。"
        },
        isEmail: {
          msg: "正しいメールアドレスを入力してください。"
        }
      }
    },
    // パスワードのバリデーションはexpressでやらないとできない、テンプレートのフォームがpasswordだから？
    pass: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};