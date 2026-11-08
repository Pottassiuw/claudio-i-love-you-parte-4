const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
  ConnectionError,
} = require('sequelize');
const AppError = require('../utils/AppError');

/** Rota não encontrada -> 404 */
function notFound(req, res) {
  return res.status(404).json({ erro: `Rota ${req.method} ${req.originalUrl} não encontrada` });
}

/**
 * Converte qualquer erro em uma resposta JSON com o status HTTP adequado.
 * Nunca devolve stack trace, SQL, nome de tabela interna, host ou credenciais do banco.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // JSON malformado no corpo da requisição
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }

  // Erros de negócio lançados pelos services
  if (err instanceof AppError) {
    const corpo = { erro: err.message };
    if (err.detalhes) corpo.detalhes = err.detalhes;
    return res.status(err.statusCode).json(corpo);
  }

  // UniqueConstraintError é subclasse de ValidationError, por isso vem antes
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      erro: 'Registro duplicado',
      detalhes: err.errors.map((e) => e.message),
    });
  }

  // Validações definidas nos models (validate / allowNull / isIn ...)
  if (err instanceof ValidationError) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.errors.map((e) => e.message),
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({ erro: 'Referência inválida: o registro relacionado não existe' });
  }

  // Falhas de conexão ou de banco: loga apenas o tipo do erro, sem mensagem detalhada
  if (err instanceof ConnectionError || err instanceof DatabaseError) {
    console.error(`[erro de banco] ${err.name}`);
    return res.status(500).json({ erro: 'Erro interno ao acessar o banco de dados. Tente novamente mais tarde' });
  }

  console.error(`[erro inesperado] ${err.name}: ${err.message}`);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = { notFound, errorHandler };
