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
    }
  };
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Full name required',
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email address already used!',
      },
      validate: {
        notNull: {
          msg: 'Email address required',
        },
        isEmail: {
          msg: 'Email address invalid!',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password required',
        },
        max:{
          args:[10],
          msg: 'Maximum 10 characters allowed in password'
        },
        min:{
          args:[6],
          msg: 'Minimum 6 characters required in password'
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Gender required',
        },
        isIn: {
          args: [['male', 'female']],
          msg: 'gender can only be \'male\' or \'female\''
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Role required',
        },
        isIn: {
          args: [['admin', 'user']],
          msg: 'role can only be \'admin\' or \'user\''
        }
      }
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Balance required',
        },
      }

    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
