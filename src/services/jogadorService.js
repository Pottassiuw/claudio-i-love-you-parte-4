const { Jogador } = require('../models');
const AppError = require('../utils/AppError');
const { isIdValido } = require('../utils/numeros');

function validarId(id) {
  if (!isIdValido(id)) throw new AppError(400, 'O id do jogador deve ser um número inteiro positivo');
  return Number(id);
}

/** Converte "true"/"false" (query string) para boolean. */
function parseBooleano(valor, campo) {
  if (valor === undefined) return undefined;
  if (valor === true || valor === 'true') return true;
  if (valor === false || valor === 'false') return false;
  throw new AppError(400, `O campo "${campo}" deve ser true ou false`);
}

/** POST /jogadores -> Model.create() */
async function cadastrarJogador({ nome, posicao, ativo }) {
  const dados = { nome: typeof nome === 'string' ? nome.trim() : nome, posicao };
  if (ativo !== undefined) dados.ativo = parseBooleano(ativo, 'ativo');
  // As validações do model (nome obrigatório, posição G/Z/M/A) geram ValidationError -> HTTP 400
  return Jogador.create(dados);
}

/** GET /jogadores -> Model.findAll() com filtros opcionais por posição e status */
async function listarJogadores({ posicao, ativo } = {}) {
  const where = {};
  if (posicao !== undefined) {
    if (!Jogador.POSICOES.includes(posicao)) throw new AppError(400, 'Posição inválida. Use G, Z, M ou A');
    where.posicao = posicao;
  }
  const ativoBool = parseBooleano(ativo, 'ativo');
  if (ativoBool !== undefined) where.ativo = ativoBool;

  return Jogador.findAll({ where, order: [['nome', 'ASC']] });
}

/** GET /jogadores/:id -> Model.findByPk() */
async function buscarJogador(id) {
  const jogador = await Jogador.findByPk(validarId(id));
  if (!jogador) throw new AppError(404, 'Jogador não encontrado');
  return jogador;
}

/** PUT /jogadores/:id -> instancia.update() */
async function atualizarJogador(id, { nome, posicao, ativo }) {
  const jogador = await buscarJogador(id);

  const dados = {};
  if (nome !== undefined) dados.nome = typeof nome === 'string' ? nome.trim() : nome;
  if (posicao !== undefined) dados.posicao = posicao;
  if (ativo !== undefined) dados.ativo = parseBooleano(ativo, 'ativo'); // permite reativar
  if (Object.keys(dados).length === 0) {
    throw new AppError(400, 'Informe ao menos um campo para atualizar: nome, posicao ou ativo');
  }

  return jogador.update(dados);
}

/**
 * PATCH /jogadores/:id/desativar -> altera ativo para false.
 * Não há exclusão física: os treinos (histórico) continuam no banco.
 */
async function desativarJogador(id) {
  const jogador = await buscarJogador(id);
  if (!jogador.ativo) return { jogador, jaEstavaInativo: true };
  await jogador.update({ ativo: false });
  return { jogador, jaEstavaInativo: false };
}

module.exports = {
  cadastrarJogador,
  listarJogadores,
  buscarJogador,
  atualizarJogador,
  desativarJogador,
  validarId,
};
