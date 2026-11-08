const treinoService = require('../services/treinoService');

async function registrarTreino(req, res, next) {
  try {
    const treino = await treinoService.registrarTreino(req.body);
    return res.status(201).json(treino);
  } catch (err) {
    return next(err);
  }
}

async function listarTreinos(req, res, next) {
  try {
    const treinos = await treinoService.listarTreinos(req.query);
    return res.status(200).json({ total: treinos.length, treinos });
  } catch (err) {
    return next(err);
  }
}

async function listarTreinosDoJogador(req, res, next) {
  try {
    const resultado = await treinoService.listarTreinosDoJogador(req.params.id, req.query);
    return res.status(200).json(resultado);
  } catch (err) {
    return next(err);
  }
}

async function excluirTreino(req, res, next) {
  try {
    const treino = await treinoService.excluirTreino(req.params.codigo);
    return res.status(200).json({ mensagem: 'Treino excluído com sucesso', treino });
  } catch (err) {
    return next(err);
  }
}

module.exports = { registrarTreino, listarTreinos, listarTreinosDoJogador, excluirTreino };
