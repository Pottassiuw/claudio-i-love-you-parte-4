const { Op, fn, col } = require('sequelize');
const { Treino, Jogador } = require('../models');
const { obterSemana } = require('../utils/datas');
const { arredondar } = require('../utils/numeros');
const { estaEmRisco } = require('./cargaService');
const { buscarConfiguracaoAtual } = require('./configuracaoService');

const DESCRICAO_TIPO = { F: 'Físico', T: 'Técnico', E: 'Estratégico' };
const DESCRICAO_POSICAO = { G: 'Goleiro', Z: 'Zagueiro', M: 'Meio-campo', A: 'Atacante' };

const CRITERIOS = {
  semana: 'A semana vai de segunda-feira a domingo e é aquela que contém a data informada.',
  rankings:
    'Maior e menor carga consideram apenas jogadores com pelo menos um treino na semana. ' +
    'Jogadores sem treino na semana não aparecem nos rankings.',
  empates: 'Em caso de empate na maior ou menor carga, todos os jogadores empatados são listados (empate = true).',
  risco:
    'RISCO DE SOBRECARGA somente quando a carga semanal é estritamente maior que a carga máxima configurada. ' +
    'Carga igual ao limite NÃO é risco.',
  semTreinos: 'Semanas sem treinos retornam totais zerados, listas vazias e rankings nulos (HTTP 200).',
};

/** Total de treinos na semana -> Model.count() */
function contarTreinos(where) {
  return Treino.count({ where });
}

/** Carga semanal e nº de treinos por jogador -> SUM + COUNT + GROUP BY com include do Jogador. */
function agregarPorJogador(where) {
  return Treino.findAll({
    attributes: [
      'jogadorId',
      [fn('SUM', col('Treino.carga')), 'cargaSemanal'],
      [fn('COUNT', col('Treino.id')), 'quantidadeTreinos'],
    ],
    include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome', 'posicao', 'ativo'] }],
    where,
    group: ['Treino.jogadorId', 'jogador.id'],
    order: [[fn('SUM', col('Treino.carga')), 'DESC']],
    raw: true,
    nest: true,
  });
}

/** Carga média por sessão de cada tipo (F, T, E) -> AVG + COUNT + GROUP BY tipo. */
function agregarPorTipo(where) {
  return Treino.findAll({
    attributes: [
      'tipo',
      [fn('COUNT', col('Treino.id')), 'quantidadeTreinos'],
      [fn('AVG', col('Treino.carga')), 'cargaMedia'],
    ],
    where,
    group: ['tipo'],
    raw: true,
  });
}

/** Treinos e carga média por sessão de cada posição -> include sem atributos + GROUP BY jogador.posicao. */
function agregarPorPosicao(where) {
  return Treino.findAll({
    attributes: [
      [col('jogador.posicao'), 'posicao'],
      [fn('COUNT', col('Treino.id')), 'quantidadeTreinos'],
      [fn('AVG', col('Treino.carga')), 'cargaMediaPorSessao'],
    ],
    include: [{ model: Jogador, as: 'jogador', attributes: [] }],
    where,
    group: ['jogador.posicao'],
    raw: true,
  });
}

/** Seleciona todos os jogadores com a carga extrema (maior ou menor), tratando empates. */
function extremo(porJogador, comparador) {
  if (porJogador.length === 0) return null;
  const alvo = porJogador.reduce((acc, j) => (comparador(j.cargaSemanal, acc) ? j.cargaSemanal : acc), porJogador[0].cargaSemanal);
  const jogadores = porJogador
    .filter((j) => Math.round(j.cargaSemanal * 100) === Math.round(alvo * 100))
    .map(({ jogadorId, nome, posicao, cargaSemanal, quantidadeTreinos }) => ({
      jogadorId,
      nome,
      posicao,
      cargaSemanal,
      quantidadeTreinos,
    }));
  return { cargaSemanal: alvo, empate: jogadores.length > 1, jogadores };
}

/**
 * GET /relatorios/semanal?data=AAAA-MM-DD
 * Consolida a semana (segunda a domingo) que contém a data informada.
 * As 4 consultas são independentes, então rodam em paralelo com Promise.all.
 */
async function gerarRelatorioSemanal(dataReferencia) {
  const { inicio, fim } = obterSemana(dataReferencia);
  const where = { dataTreino: { [Op.between]: [inicio, fim] } };

  const [config, totalTreinos, linhasJogador, linhasTipo, linhasPosicao] = await Promise.all([
    buscarConfiguracaoAtual(),
    contarTreinos(where),
    agregarPorJogador(where),
    agregarPorTipo(where),
    agregarPorPosicao(where),
  ]);

  const limite = config ? Number(config.cargaMaximaSemanal) : null;

  // Por jogador (ordenado da maior para a menor carga; empate desempata por nome só para exibição)
  const porJogador = linhasJogador
    .map((l) => {
      const cargaSemanal = arredondar(l.cargaSemanal);
      const risco = estaEmRisco(cargaSemanal, limite);
      return {
        jogadorId: l.jogadorId,
        nome: l.jogador.nome,
        posicao: l.jogador.posicao,
        ativo: Boolean(l.jogador.ativo),
        cargaSemanal,
        quantidadeTreinos: Number(l.quantidadeTreinos),
        situacao: limite === null ? 'SEM LIMITE CONFIGURADO' : risco ? 'RISCO DE SOBRECARGA' : 'DENTRO DO LIMITE',
        emRisco: risco,
      };
    })
    .sort((a, b) => b.cargaSemanal - a.cargaSemanal || a.nome.localeCompare(b.nome));

  const emRisco = porJogador.filter((j) => j.emRisco);

  // Média por tipo: sempre devolve F, T e E (tipo sem sessões -> quantidade 0 e média null)
  const mediaPorTipo = Treino.TIPOS.map((tipo) => {
    const linha = linhasTipo.find((l) => l.tipo === tipo);
    return {
      tipo,
      descricao: DESCRICAO_TIPO[tipo],
      quantidadeTreinos: linha ? Number(linha.quantidadeTreinos) : 0,
      cargaMedia: linha ? arredondar(linha.cargaMedia) : null,
    };
  });

  // Por posição: sempre devolve G, Z, M e A
  const porPosicao = Jogador.POSICOES.map((posicao) => {
    const linha = linhasPosicao.find((l) => l.posicao === posicao);
    return {
      posicao,
      descricao: DESCRICAO_POSICAO[posicao],
      quantidadeTreinos: linha ? Number(linha.quantidadeTreinos) : 0,
      cargaMediaPorSessao: linha ? arredondar(linha.cargaMediaPorSessao) : null,
    };
  });

  const semTreinos = totalTreinos === 0;

  return {
    semana: { referencia: dataReferencia, inicio, fim },
    cargaMaximaSemanal: limite,
    avisos: [
      ...(semTreinos ? ['Nenhum treino registrado nesta semana.'] : []),
      ...(limite === null ? ['Nenhum limite configurado: o risco de sobrecarga não pôde ser avaliado (PUT /configuracao).'] : []),
    ],
    criterios: CRITERIOS,
    totalTreinos,
    jogadoresComTreino: porJogador.length,
    porJogador,
    maiorCargaSemanal: extremo(porJogador, (valor, atual) => valor > atual),
    menorCargaSemanal: extremo(porJogador, (valor, atual) => valor < atual),
    jogadoresEmRisco: {
      quantidade: limite === null ? null : emRisco.length,
      jogadores: emRisco.map(({ jogadorId, nome, posicao, cargaSemanal }) => ({
        jogadorId,
        nome,
        posicao,
        cargaSemanal,
        excedente: arredondar(cargaSemanal - limite),
      })),
    },
    mediaPorTipo,
    porPosicao,
  };
}

module.exports = { gerarRelatorioSemanal };
