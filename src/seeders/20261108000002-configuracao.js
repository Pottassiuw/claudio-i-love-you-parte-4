'use strict';

/** Limite de 200 pontos/semana: gera atletas acima, abaixo e um exatamente no limite. */
module.exports = {
  async up(queryInterface) {
    const agora = new Date();
    await queryInterface.bulkInsert('configuracoes', [
      { id: 1, cargaMaximaSemanal: 200, dataVigencia: '2026-10-01', createdAt: agora, updatedAt: agora },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('configuracoes', { id: 1 });
  },
};
