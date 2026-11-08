const { Configuracao } = require('../models');
const AppError = require('../utils/AppError');
const { validarData } = require('../utils/datas');

/** Busca a configuração vigente (registro mais recente) ou null. */
async function buscarConfiguracaoAtual() {
  return Configuracao.findOne({ order: [['id', 'DESC']] });
}

/** GET /configuracao */
async function obterConfiguracao() {
  const config = await buscarConfiguracaoAtual();
  if (!config) throw new AppError(404, 'Nenhum limite de carga semanal foi configurado ainda. Use PUT /configuracao');
  return config;
}

/**
 * PUT /configuracao -> cria (201) se ainda não existir, ou atualiza (200) a configuração existente.
 */
async function definirConfiguracao({ cargaMaximaSemanal, dataVigencia }) {
  const limite = Number(cargaMaximaSemanal);
  if (cargaMaximaSemanal === undefined || cargaMaximaSemanal === null || cargaMaximaSemanal === '' || !Number.isFinite(limite)) {
    throw new AppError(400, 'cargaMaximaSemanal é obrigatória e deve ser numérica');
  }
  if (limite <= 0) throw new AppError(400, 'cargaMaximaSemanal deve ser maior que zero');
  if (dataVigencia !== undefined && dataVigencia !== null) validarData(dataVigencia, 'dataVigencia');

  const dados = { cargaMaximaSemanal: limite };
  if (dataVigencia !== undefined) dados.dataVigencia = dataVigencia;

  const atual = await buscarConfiguracaoAtual();
  if (atual) {
    await atual.update(dados);
    return { configuracao: atual, criada: false };
  }
  const configuracao = await Configuracao.create(dados);
  return { configuracao, criada: true };
}

module.exports = { obterConfiguracao, definirConfiguracao, buscarConfiguracaoAtual };
