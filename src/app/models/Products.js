import Sequelize, { Model } from 'sequelize';

class Products extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.FLOAT,
        category_id: Sequelize.INTEGER,
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,

        // Soft Delete
        active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },

        URL: {
          type: Sequelize.VIRTUAL,
          get() {
            return `https://dev-burger-api-1-9g81.onrender.com/category-file/${this.path}`
          },
        },
      },
      {
        sequelize,
        tableName: 'products',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
  }
}

export default Products;