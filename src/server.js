require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = Number(process.env.PORT) || 3000;

async function iniciar() {
  try {
    // Testa a conexão antes de subir o servidor (async/await)
    await sequelize.authenticate();
    console.log('Conexão com o MySQL estabelecida.');
    // As tabelas são criadas pelas migrations (npm run db:migrate), não por sync().
    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
      console.log(`Swagger em http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    // Mostra só o tipo do erro: nunca imprime usuário/senha do banco
    console.error(`Não foi possível conectar ao banco de dados (${err.name}). Verifique o MySQL e o arquivo .env.`);
    process.exit(1);
  }
}

iniciar();
