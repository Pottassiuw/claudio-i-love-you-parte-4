const relatorioService = require('../services/relatorioService');

async function relatorioSemanal(req, res, next) {
  try {
    const relatorio = await relatorioService.gerarRelatorioSemanal(req.query.data);
    return res.status(200).json(relatorio);
  } catch (err) {
    return next(err);
  }
}

module.exports = { relatorioSemanal };
