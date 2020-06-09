/* eslint-disable no-console */
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const configdb = require('../config/database.config');

const basename = path.basename(__filename);
const db = {};
const sequelize = new Sequelize(configdb.database, configdb.username, configdb.password, {
  host: configdb.host,
  dialect: configdb.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
fs.readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0
            && file !== basename
            && file.slice(-3) === '.js'
  ))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
sequelize
// .sync()
  .sync()
  .then(() => {
    console.log('All models were synchronized successfully');
  })
  .catch((err) => {
    console.log(err);
  });
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
