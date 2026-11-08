// Inicializa a conexão Sequelize, carrega os models e registra as associações.
const { Sequelize } = require('sequelize');
const configs = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = configs[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {
  Jogador: require('./jogador')(sequelize),
  Treino: require('./treino')(sequelize),
  Configuracao: require('./configuracao')(sequelize),
};

// Cada model declara suas associações em associate()
Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
