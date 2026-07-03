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
      },
      {
        sequelize,
        tableName: 'users',
        underscored: true,
      },
    )
    // biome-ignore lint/correctness/noUnreachable: <explanation>
    return this;
  }
}

export default User;