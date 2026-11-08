const jogadorService = require('../services/jogadorService');

// Os controllers só tratam HTTP (req/res). A regra de negócio fica nos services.
// Erros são repassados com next(err) e convertidos em status HTTP pelo errorHandler.

async function cadastrarJogador(req, res, next) {
  try {
    const jogador = await jogadorService.cadastrarJogador(req.body);
    return res.status(201).json(jogador);
  } catch (err) {
    return next(err);
  }
}

async function listarJogadores(req, res, next) {
  try {
    const jogadores = await jogadorService.listarJogadores(req.query);
    return res.status(200).json(jogadores);
  } catch (err) {
    return next(err);
  }
}

async function buscarJogador(req, res, next) {
  try {
    const jogador = await jogadorService.buscarJogador(req.params.id);
    return res.status(200).json(jogador);
  } catch (err) {
    return next(err);
  }
}

async function atualizarJogador(req, res, next) {
  try {
    const jogador = await jogadorService.atualizarJogador(req.params.id, req.body);
    return res.status(200).json(jogador);
  } catch (err) {
    return next(err);
  }
}

async function desativarJogador(req, res, next) {
  try {
    const { jogador, jaEstavaInativo } = await jogadorService.desativarJogador(req.params.id);
    return res.status(200).json({
      mensagem: jaEstavaInativo
        ? 'O jogador já estava inativo'
        : 'Jogador desativado com sucesso. O histórico de treinos foi preservado',
      jogador,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { cadastrarJogador, listarJogadores, buscarJogador, atualizarJogador, desativarJogador };
