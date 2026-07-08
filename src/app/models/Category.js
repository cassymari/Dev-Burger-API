import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        URL:{
                  type: Sequelize.VIRTUAL,
                  get(){
                    return `https://dev-burger-api-1-9g81.onrender.com/products-file/${this.path}`
                  },
                },

      },
    
    {
        sequelize,
        tableName: 'categories',
    });

     return this;
  }
}


export default Category;