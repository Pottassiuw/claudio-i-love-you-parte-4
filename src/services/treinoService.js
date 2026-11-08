const { Op } = require('sequelize');
const { Treino, Jogador } = require('../models');
const AppError = require('../utils/AppError');
const { paraInteiro, isIdValido } = require('../utils/numeros');
const { isDataValida, validarData } = require('../utils/datas');
const { calcularCarga, validarParametrosCarga } = require('./cargaService');
const { validarId } = require('./jogadorService');

// Dados do jogador que acompanham cada treino nas listagens (include)
const INCLUDE_JOGADOR = {
  model: Jogador,
  as: 'jogador',
  attributes: ['id', 'nome', 'posicao', 'ativo'],
};

/** Valida o corpo do POST /treinos e devolve todos os erros de uma vez. */
function validarDadosTreino({ codigo, jogadorId, dataTreino, tipo, duracaoMin, intensidade }) {
  const erros = [];
  if (typeof codigo !== 'string' || codigo.trim() === '') erros.push('O código é obrigatório');
  if (!isIdValido(jogadorId)) erros.push('O jogadorId deve ser um número inteiro positivo');
  if (!isDataValida(dataTreino)) erros.push('A data do treino (dataTreino) é obrigatória no formato AAAA-MM-DD');
  erros.push(...validarParametrosCarga({ duracaoMin, intensidade, tipo }));
  return erros;
}

/**
 * POST /treinos -> valida, calcula a carga e cria o treino.
 * Ordem das verificações: dados (400) -> jogador existe (404) -> jogador ativo (400) -> código único (409).
 */
async function registrarTreino(dados) {
  const erros = validarDadosTreino(dados);
  if (erros.length) throw new AppError(400, 'Dados do treino inválidos', erros);

  const codigo = dados.codigo.trim();
  const jogadorId = Number(dados.jogadorId);

  const jogador = await Jogador.findByPk(jogadorId);
  if (!jogador) throw new AppError(404, 'Jogador não encontrado');
  if (!jogador.ativo) throw new AppError(400, 'Não é possível registrar treino para um jogador inativo');

  const existente = await Treino.findOne({ where: { codigo } });
  if (existente) throw new AppError(409, `Já existe um treino com o código "${codigo}"`);

  const duracaoMin = paraInteiro(dados.duracaoMin);
  const intensidade = paraInteiro(dados.intensidade);
  const carga = calcularCarga(duracaoMin, intensidade, dados.tipo);

  // Se outro request gravar o mesmo código entre o findOne e o create,
  // a constraint UNIQUE do banco gera UniqueConstraintError -> 409 no errorHandler.
  const treino = await Treino.create({
    codigo,
    jogadorId,
    dataTreino: dados.dataTreino,
    tipo: dados.tipo,
    duracaoMin,
    intensidade,
    carga,
  });

  return Treino.findByPk(treino.id, { include: [INCLUDE_JOGADOR] });
}

/** Monta o where de período com Op.between / Op.gte / Op.lte. */
function filtroPeriodo(dataInicio, dataFim) {
  if (dataInicio !== undefined) validarData(dataInicio, 'dataInicio');
  if (dataFim !== undefined) validarData(dataFim, 'dataFim');
  if (dataInicio && dataFim) {
    if (dataInicio > dataFim) throw new AppError(400, 'dataInicio não pode ser maior que dataFim');
    return { [Op.between]: [dataInicio, dataFim] };
  }
  if (dataInicio) return { [Op.gte]: dataInicio };
  if (dataFim) return { [Op.lte]: dataFim };
  return undefined;
}

/** GET /treinos -> findAll() com include do jogador e where com filtros opcionais. */
async function listarTreinos({ jogadorId, tipo, dataInicio, dataFim, posicao } = {}) {
  const where = {};
  if (jogadorId !== undefined) where.jogadorId = validarId(jogadorId);
  if (tipo !== undefined) {
    if (!Treino.TIPOS.includes(tipo)) throw new AppError(400, 'Tipo inválido. Use F, T ou E');
    where.tipo = tipo;
  }
  const periodo = filtroPeriodo(dataInicio, dataFim);
  if (periodo) where.dataTreino = periodo;

  const include = { ...INCLUDE_JOGADOR };
  if (posicao !== undefined) {
    if (!Jogador.POSICOES.includes(posicao)) throw new AppError(400, 'Posição inválida. Use G, Z, M ou A');
    include.where = { posicao }; // filtro aplicado na tabela associada (INNER JOIN)
  }

  return Treino.findAll({
    where,
    include: [include],
    order: [['dataTreino', 'ASC'], ['codigo', 'ASC']],
  });
}

/** GET /treinos/jogador/:id -> jogador + seus treinos (404 se o jogador não existir). */
async function listarTreinosDoJogador(id, filtros = {}) {
  const jogadorId = validarId(id);
  const jogador = await Jogador.findByPk(jogadorId, { attributes: ['id', 'nome', 'posicao', 'ativo'] });
  if (!jogador) throw new AppError(404, 'Jogador não encontrado');

  const treinos = await listarTreinos({ ...filtros, jogadorId });
  return { jogador, total: treinos.length, treinos };
}

/** DELETE /treinos/:codigo -> destroy() com verificação prévia (404 se não existir). */
async function excluirTreino(codigo) {
  const treino = await Treino.findOne({ where: { codigo } });
  if (!treino) throw new AppError(404, `Treino com código "${codigo}" não encontrado`);
  await treino.destroy();
  return treino;
}

module.exports = { registrarTreino, listarTreinos, listarTreinosDoJogador, excluirTreino };
