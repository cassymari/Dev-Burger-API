import 'dotenv/config';

const databaseConfig = {
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

  logging: false,
};

export default databaseConfig;