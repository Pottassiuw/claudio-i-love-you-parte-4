// Erro de negócio com status HTTP associado. É tratado pelo middleware errorHandler.
class AppError extends Error {
  constructor(statusCode, message, detalhes) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }
}

module.exports = AppError;
