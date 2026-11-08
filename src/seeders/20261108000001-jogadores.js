'use strict';

/**
 * 9 atletas cobrindo as quatro posições (G, Z, M, A).
 * O atleta 9 está INATIVO para testar o bloqueio de cadastro de treino.
 */
module.exports = {
  async up(queryInterface) {
    const agora = new Date();
    const jogadores = [
      { id: 1, nome: 'Carlos Henrique', posicao: 'G', ativo: true },
      { id: 2, nome: 'Bruno Alves', posicao: 'Z', ativo: true },
      { id: 3, nome: 'Diego Souza', posicao: 'M', ativo: true },
      { id: 4, nome: 'André Lima', posicao: 'A', ativo: true },
      { id: 5, nome: 'Lucas Pereira', posicao: 'Z', ativo: true },
      { id: 6, nome: 'Mateus Rocha', posicao: 'M', ativo: true },
      { id: 7, nome: 'Pedro Santos', posicao: 'A', ativo: true },
      { id: 8, nome: 'Thiago Martins', posicao: 'G', ativo: true },
      { id: 9, nome: 'Felipe Costa', posicao: 'M', ativo: false },
    ].map((j) => ({ ...j, createdAt: agora, updatedAt: agora }));

    await queryInterface.bulkInsert('jogadores', jogadores);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('jogadores', { id: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
  },
};
