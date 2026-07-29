import Sequelize, { Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
        reset_password_token: Sequelize.STRING,
        reset_password_expires: Sequelize.DATE,
      },
      {
        sequelize,
        tableName: 'users',
        underscored: true,
      },
    )
    
  }
}

export default User;