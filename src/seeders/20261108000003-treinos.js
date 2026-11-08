'use strict';

const { calcularCarga } = require('../services/cargaService');

/**
 * 22 treinos em duas semanas, com os três tipos (F, T, E).
 * A carga é calculada pela MESMA função usada na API (calcularCarga).
 *
 * Semana 1: 05/10/2026 (seg) a 11/10/2026 (dom) - limite 200
 *   Diego  (M)  72 + 75,6 + 67,5 = 215,1  -> RISCO
 *   Lucas  (Z)  94,5 + 108       = 202,5  -> RISCO (treino de domingo 11/10)
 *   Bruno  (Z)  120 + 80         = 200,0  -> igual ao limite: NÃO é risco
 *   André  (A)  72 + 48 + 36     = 156,0
 *   Carlos (G)  36 + 20          =  56,0
 *   Mateus (M)  24               =  24,0  -> menor carga
 *   Pedro e Thiago: sem treino (fora dos rankings)
 *
 * Semana 2: 12/10/2026 (seg) a 18/10/2026 (dom)
 *   André  (A)  135 + 81            = 216,0 -> RISCO
 *   Pedro  (A)  63 + 76,8 + 54      = 193,8 (treino de segunda 12/10)
 *   Thiago (G)  43,2 + 12           =  55,2
 *   Diego  (M)  24                  =  24,0 -> empate na menor carga
 *   Mateus (M)  24                  =  24,0 -> empate na menor carga
 */
const TREINOS = [
  // ---------- Semana 1 ----------
  ['TR-001', 3, '2026-10-05', 'F', 60, 8],
  ['TR-002', 3, '2026-10-07', 'T', 90, 7],
  ['TR-003', 3, '2026-10-09', 'F', 50, 9],
  ['TR-004', 4, '2026-10-05', 'F', 60, 8],
  ['TR-005', 4, '2026-10-06', 'E', 80, 6],
  ['TR-006', 4, '2026-10-08', 'T', 60, 5],
  ['TR-007', 2, '2026-10-06', 'F', 80, 10],
  ['TR-008', 2, '2026-10-08', 'E', 80, 10],
  ['TR-009', 1, '2026-10-07', 'T', 50, 6],
  ['TR-010', 1, '2026-10-09', 'E', 40, 5],
  ['TR-011', 5, '2026-10-06', 'F', 70, 9],
  ['TR-012', 5, '2026-10-11', 'T', 100, 9],
  ['TR-013', 6, '2026-10-10', 'E', 60, 4],
  // ---------- Semana 2 ----------
  ['TR-014', 7, '2026-10-12', 'F', 60, 7],
  ['TR-015', 7, '2026-10-14', 'T', 80, 8],
  ['TR-016', 7, '2026-10-16', 'E', 90, 6],
  ['TR-017', 8, '2026-10-13', 'T', 60, 6],
  ['TR-018', 8, '2026-10-15', 'E', 40, 3],
  ['TR-019', 3, '2026-10-14', 'T', 40, 5],
  ['TR-020', 4, '2026-10-13', 'F', 90, 10],
  ['TR-021', 4, '2026-10-17', 'F', 60, 9],
  ['TR-022', 6, '2026-10-18', 'E', 60, 4],
];

module.exports = {
  async up(queryInterface) {
    const agora = new Date();
    const linhas = TREINOS.map(([codigo, jogadorId, dataTreino, tipo, duracaoMin, intensidade]) => ({
      codigo,
      jogadorId,
      dataTreino,
      tipo,
      duracaoMin,
      intensidade,
      carga: calcularCarga(duracaoMin, intensidade, tipo),
      createdAt: agora,
      updatedAt: agora,
    }));
    await queryInterface.bulkInsert('treinos', linhas);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('treinos', { codigo: TREINOS.map((t) => t[0]) });
  },
};
