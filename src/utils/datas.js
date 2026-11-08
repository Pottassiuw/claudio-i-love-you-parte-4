const AppError = require('./AppError');

const UM_DIA_MS = 24 * 60 * 60 * 1000;

/** Verifica se a string está no formato AAAA-MM-DD e representa uma data real (rejeita 2026-02-30). */
function isDataValida(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const d = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === valor;
}

/** Lança 400 se a data for inválida. */
function validarData(valor, campo = 'data') {
  if (!isDataValida(valor)) {
    throw new AppError(400, `Parâmetro "${campo}" inválido. Use o formato AAAA-MM-DD (ex.: 2026-10-05)`);
  }
  return valor;
}

/**
 * Recebe qualquer data e devolve a semana (segunda-feira a domingo) que a contém.
 * Os cálculos são feitos em UTC sobre a data pura, sem horário, para não haver deslocamento por fuso.
 */
function obterSemana(dataReferencia) {
  validarData(dataReferencia, 'data');
  const d = new Date(`${dataReferencia}T00:00:00Z`);
  const diasDesdeSegunda = (d.getUTCDay() + 6) % 7; // domingo(0) -> 6, segunda(1) -> 0 ...
  const segunda = new Date(d.getTime() - diasDesdeSegunda * UM_DIA_MS);
  const domingo = new Date(segunda.getTime() + 6 * UM_DIA_MS);
  return {
    inicio: segunda.toISOString().slice(0, 10),
    fim: domingo.toISOString().slice(0, 10),
  };
}

module.exports = { isDataValida, validarData, obterSemana };
