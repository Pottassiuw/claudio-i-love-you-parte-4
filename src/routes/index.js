const { Router } = require('express');
const jogador = require('../controllers/jogadorController');
const treino = require('../controllers/treinoController');
const configuracao = require('../controllers/configuracaoController');
const relatorio = require('../controllers/relatorioController');
const { sequelize } = require('../models');

const router = Router();

// Jogadores
router.post('/jogadores', jogador.cadastrarJogador);
router.get('/jogadores', jogador.listarJogadores);
router.get('/jogadores/:id', jogador.buscarJogador);
router.put('/jogadores/:id', jogador.atualizarJogador);
router.patch('/jogadores/:id/desativar', jogador.desativarJogador);

// Configuração (limite de carga semanal)
router.get('/configuracao', configuracao.obterConfiguracao);
router.put('/configuracao', configuracao.definirConfiguracao);

// Treinos (a rota /treinos/jogador/:id vem antes de /treinos/:codigo por clareza)
router.post('/treinos', treino.registrarTreino);
router.get('/treinos', treino.listarTreinos);
router.get('/treinos/jogador/:id', treino.listarTreinosDoJogador);
router.delete('/treinos/:codigo', treino.excluirTreino);

// Relatórios
router.get('/relatorios/semanal', relatorio.relatorioSemanal);

// Saúde da API e do banco (útil para demonstrar falha sem vazar credenciais)
router.get('/saude', async (req, res, next) => {
  try {
    await sequelize.authenticate();
    return res.status(200).json({ status: 'ok', banco: 'conectado' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
