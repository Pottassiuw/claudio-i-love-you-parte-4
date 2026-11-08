const AppError = require('../utils/AppError');
const { arredondar, paraInteiro } = require('../utils/numeros');

// Multiplicador por tipo de treino (regra de negócio)
const MULTIPLICADORES = Object.freeze({
  F: 1.5, // Físico
  T: 1.2, // Técnico
  E: 1.0, // Estratégico
});

/**
 * Valida os dados usados no cálculo e devolve a lista de erros (vazia se tudo estiver certo).
 */
function validarParametrosCarga({ duracaoMin, intensidade, tipo }) {
  const erros = [];
  const duracao = paraInteiro(duracaoMin);
  const intens = paraInteiro(intensidade);

  if (Number.isNaN(duracao)) erros.push('A duração (duracaoMin) deve ser um número inteiro');
  else if (duracao <= 0) erros.push('A duração deve ser positiva (maior que zero)');

  if (Number.isNaN(intens)) erros.push('A intensidade deve ser um número inteiro');
  else if (intens < 1 || intens > 10) erros.push('A intensidade deve estar entre 1 e 10');

  if (!Object.prototype.hasOwnProperty.call(MULTIPLICADORES, tipo)) {
    erros.push('Tipo inválido. Use F (Físico), T (Técnico) ou E (Estratégico)');
  }
  return erros;
}

/**
 * Carga do treino = (duração em minutos / 10) × intensidade × multiplicador do tipo.
 * Ex.: físico, 60 min, intensidade 8 -> (60 / 10) × 8 × 1,5 = 72 pontos.
 * Função pura e reutilizável: usada pelo serviço de treinos, pelos seeders e pelos testes.
 */
function calcularCarga(duracaoMin, intensidade, tipo) {
  const erros = validarParametrosCarga({ duracaoMin, intensidade, tipo });
  if (erros.length) throw new AppError(400, 'Dados inválidos para o cálculo da carga', erros);

  const carga = (Number(duracaoMin) / 10) * Number(intensidade) * MULTIPLICADORES[tipo];
  return arredondar(carga);
}

/**
 * Regra do risco: SOMENTE quando a carga semanal for ESTRITAMENTE maior que o limite.
 * No empate não há risco. A comparação é feita em centésimos (inteiros) para evitar erro de ponto flutuante.
 */
function estaEmRisco(cargaSemanal, cargaMaximaSemanal) {
  if (cargaMaximaSemanal === null || cargaMaximaSemanal === undefined) return false;
  return Math.round(Number(cargaSemanal) * 100) > Math.round(Number(cargaMaximaSemanal) * 100);
}

module.exports = { MULTIPLICADORES, calcularCarga, validarParametrosCarga, estaEmRisco };
