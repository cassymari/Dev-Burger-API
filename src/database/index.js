import { Sequelize } from "sequelize";
import mongoose from "mongoose";
import databaseConfig from "../config/database.js";
import User from "../app/models/User.js";
import Products from '../app/models/Products.js';
import Category from "../app/models/Category.js";




const models = [User, Products, Category];

class Database {
    constructor(){
        this.init();
        this.mongo();
    }

   async init() {
  this.connection = new Sequelize(databaseConfig);

  try {
    await this.connection.authenticate();
    console.log("✅ PostgreSQL conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao PostgreSQL:");
    console.error(error);
  }

  models
    .map((model) => model.init(this.connection))
    .map(
      (model) => model.associate && model.associate(this.connection.models)
    );
}

    mongo(){
        this.mongooseConnection = mongoose.connect(process.env.MONGO_URL)
    }
}

export default new Database();