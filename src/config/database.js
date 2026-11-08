// Configuração do banco usada tanto pela aplicação quanto pelo Sequelize CLI.
// As credenciais vêm SEMPRE de variáveis de ambiente (.env), nunca do código.
require('dotenv').config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  timezone: '-03:00',
  dialectOptions: {
    // Faz o mysql2 devolver DECIMAL/SUM/AVG como Number em vez de string
    decimalNumbers: true,
  },
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
  development: { ...base },
  test: { ...base, database: process.env.DB_NAME_TEST || `${base.database}_test` },
  production: { ...base, logging: false },
};
