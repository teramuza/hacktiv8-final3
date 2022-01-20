'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Category.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Type required',
        }
      },
    },

    sold_product_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'sold_product_amount must be numeric'
        },
        notNull: {
          msg: 'sold_product_amount required',
        }
      },
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
