const configuracaoService = require('../services/configuracaoService');

async function obterConfiguracao(req, res, next) {
  try {
    const config = await configuracaoService.obterConfiguracao();
    return res.status(200).json(config);
  } catch (err) {
    return next(err);
  }
}

async function definirConfiguracao(req, res, next) {
  try {
    const { configuracao, criada } = await configuracaoService.definirConfiguracao(req.body);
    return res.status(criada ? 201 : 200).json(configuracao);
  } catch (err) {
    return next(err);
  }
}

module.exports = { obterConfiguracao, definirConfiguracao };
