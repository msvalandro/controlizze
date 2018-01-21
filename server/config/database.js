import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';

let database = null;

const loadModels = (sequelize) => {
  const dir = path.join(__dirname, '../models');
  const models = [];
  fs.readdirSync(dir).forEach((file) => {
    const modelDir = path.join(dir, file);
    const model = sequelize.import(modelDir);
    models[model.name] = model;
  });
  return models;
};

export default (app) => {
  if (!database) {
    const { config } = app;
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config.params,
    );
    database = {
      sequelize,
      Sequelize,
      models: {},
    };
    database.models = loadModels(sequelize);
    sequelize.sync().done(() => database);
  }
  return database;
};
