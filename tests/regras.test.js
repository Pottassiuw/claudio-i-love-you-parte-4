// Testes unitários das regras de negócio (não precisam de banco). Rode com: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularCarga, estaEmRisco } = require('../src/services/cargaService');
const { obterSemana, isDataValida } = require('../src/utils/datas');

test('carga: exemplo do enunciado (F, 60 min, intensidade 8) = 72', () => {
  assert.equal(calcularCarga(60, 8, 'F'), 72);
});

test('carga: multiplicadores T = 1,2 e E = 1,0', () => {
  assert.equal(calcularCarga(90, 7, 'T'), 75.6);
  assert.equal(calcularCarga(80, 6, 'E'), 48);
});

test('carga: intensidade fora de 1..10 gera erro 400', () => {
  assert.throws(() => calcularCarga(60, 0, 'F'), { statusCode: 400 });
  assert.throws(() => calcularCarga(60, 11, 'F'), { statusCode: 400 });
  assert.throws(() => calcularCarga(60, 5.5, 'F'), { statusCode: 400 });
});

test('carga: duração não positiva e tipo inválido geram erro 400', () => {
  assert.throws(() => calcularCarga(0, 5, 'F'), { statusCode: 400 });
  assert.throws(() => calcularCarga(-10, 5, 'F'), { statusCode: 400 });
  assert.throws(() => calcularCarga(60, 5, 'X'), { statusCode: 400 });
});

test('risco: somente quando estritamente maior que o limite (empate não é risco)', () => {
  assert.equal(estaEmRisco(200.01, 200), true);
  assert.equal(estaEmRisco(200, 200), false);
  assert.equal(estaEmRisco(199.99, 200), false);
  assert.equal(estaEmRisco(0.1 + 0.2, 0.3), false); // sem erro de ponto flutuante
});

test('semana: vai de segunda a domingo', () => {
  assert.deepEqual(obterSemana('2026-10-05'), { inicio: '2026-10-05', fim: '2026-10-11' }); // segunda
  assert.deepEqual(obterSemana('2026-10-08'), { inicio: '2026-10-05', fim: '2026-10-11' }); // quinta
  assert.deepEqual(obterSemana('2026-10-11'), { inicio: '2026-10-05', fim: '2026-10-11' }); // domingo
  assert.deepEqual(obterSemana('2026-10-12'), { inicio: '2026-10-12', fim: '2026-10-18' }); // segunda seguinte
  assert.deepEqual(obterSemana('2026-01-01'), { inicio: '2025-12-29', fim: '2026-01-04' }); // virada de ano
});

test('datas: rejeita formatos e datas inexistentes', () => {
  assert.equal(isDataValida('2026-02-30'), false);
  assert.equal(isDataValida('05/10/2026'), false);
  assert.equal(isDataValida('2026-10-05'), true);
  assert.throws(() => obterSemana(undefined), { statusCode: 400 });
});
