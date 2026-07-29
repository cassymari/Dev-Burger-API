require('dotenv').config();

module.exports = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};