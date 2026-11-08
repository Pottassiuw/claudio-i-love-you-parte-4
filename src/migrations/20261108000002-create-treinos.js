'use strict';

/** Cria a tabela treinos com FK para jogadores */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('treinos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      codigo: { type: Sequelize.STRING(30), allowNull: false },
      jogadorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'jogadores', key: 'id' },
        onUpdate: 'CASCADE',
        // RESTRICT: impede apagar um jogador que possui histórico de treinos
        onDelete: 'RESTRICT',
      },
      dataTreino: { type: Sequelize.DATEONLY, allowNull: false },
      tipo: { type: Sequelize.ENUM('F', 'T', 'E'), allowNull: false },
      duracaoMin: { type: Sequelize.INTEGER, allowNull: false },
      intensidade: { type: Sequelize.INTEGER, allowNull: false },
      carga: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint('treinos', {
      fields: ['codigo'],
      type: 'unique',
      name: 'treinos_codigo_unique',
    });
    // Índices para acelerar os filtros por período e por jogador usados no relatório
    await queryInterface.addIndex('treinos', ['dataTreino'], { name: 'treinos_data_idx' });
    await queryInterface.addIndex('treinos', ['jogadorId', 'dataTreino'], { name: 'treinos_jogador_data_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('treinos');
  },
};
