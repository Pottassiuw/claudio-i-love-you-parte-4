const { DataTypes } = require('sequelize');

const TIPOS = ['F', 'T', 'E']; // Físico, Técnico, Estratégico

module.exports = (sequelize) => {
  const Treino = sequelize.define(
    'Treino',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      codigo: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: { name: 'treinos_codigo_unique', msg: 'Já existe um treino com este código' },
        validate: {
          notNull: { msg: 'O código é obrigatório' },
          notEmpty: { msg: 'O código não pode ser vazio' },
        },
      },
      jogadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'jogadores', key: 'id' },
        validate: { notNull: { msg: 'O jogadorId é obrigatório' } },
      },
      dataTreino: {
        // DATEONLY = tipo DATE do MySQL (sem horário): evita problemas de fuso no corte da semana
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: 'A data do treino é obrigatória' },
          isDate: { msg: 'Data do treino inválida (use AAAA-MM-DD)' },
        },
      },
      tipo: {
        type: DataTypes.ENUM(...TIPOS),
        allowNull: false,
        validate: {
          notNull: { msg: 'O tipo é obrigatório' },
          isIn: { args: [TIPOS], msg: 'Tipo inválido. Use F, T ou E' },
        },
      },
      duracaoMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'A duração é obrigatória' },
          isInt: { msg: 'A duração deve ser um número inteiro' },
          min: { args: [1], msg: 'A duração deve ser positiva (maior que zero)' },
        },
      },
      intensidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'A intensidade é obrigatória' },
          isInt: { msg: 'A intensidade deve ser um número inteiro' },
          min: { args: [1], msg: 'A intensidade deve estar entre 1 e 10' },
          max: { args: [10], msg: 'A intensidade deve estar entre 1 e 10' },
        },
      },
      carga: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: { args: [0], msg: 'A carga não pode ser negativa' } },
      },
    },
    {
      tableName: 'treinos',
    }
  );

  Treino.associate = (models) => {
    // N treinos -> 1 jogador
    Treino.belongsTo(models.Jogador, { foreignKey: 'jogadorId', as: 'jogador' });
  };

  Treino.TIPOS = TIPOS;
  return Treino;
};
