'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionHistory.belongsTo(models.User, { foreignKey: "userId" });
      TransactionHistory.belongsTo(models.Product, { foreignKey: "productId" });
    }
  }
  TransactionHistory.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validation: {
        notNull: {
          msg: "productId required"
        }
      }
    },
    userId: DataTypes.INTEGER,
    quantity: {
      type:  DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Quantity required"
        },
        isInt: {
          msg: "Quantity must be integer"
        }
      }
    },
    total_price: {
      type:  DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Total price required"
        },
        isInt: {
          msg: "Total price must be integer"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TransactionHistory',
    hooks: {
      afterCreate: (TransactionHistory) => {
        sequelize.models.User.decrement({balance: TransactionHistory.total_price}, {where: {id: TransactionHistory.userId}})
        sequelize.models.Product.decrement({stock: TransactionHistory.quantity}, {where: {id: TransactionHistory.productId}})
        sequelize.models.Category.increment({sold_product_amount: TransactionHistory.quantity}, {where: {id: sequelize.literal(
          sequelize.models.Product.findOne({attributes:['id']}, {where: {id: 1}})    
        ) 
      }})
      }
    }
  });
  return TransactionHistory;
};