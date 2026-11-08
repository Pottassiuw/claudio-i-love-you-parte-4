/** Arredonda para 2 casas decimais evitando erros de ponto flutuante (ex.: 75.6000000001). */
function arredondar(valor) {
  if (valor === null || valor === undefined) return null;
  return Math.round((Number(valor) + Number.EPSILON) * 100) / 100;
}

/** Converte para inteiro aceitando number ou string numérica. Retorna NaN se não for inteiro. */
function paraInteiro(valor) {
  if (valor === null || valor === undefined || valor === '' || typeof valor === 'boolean') return NaN;
  const n = Number(valor);
  return Number.isInteger(n) ? n : NaN;
}

/** Valida um :id de rota (inteiro positivo). */
function isIdValido(valor) {
  const n = paraInteiro(valor);
  return Number.isInteger(n) && n > 0;
}

module.exports = { arredondar, paraInteiro, isIdValido };
