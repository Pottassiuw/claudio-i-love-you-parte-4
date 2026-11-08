const { DataTypes } = require('sequelize');

const POSICOES = ['G', 'Z', 'M', 'A']; // Goleiro, Zagueiro, Meio-campo, Atacante

module.exports = (sequelize) => {
  const Jogador = sequelize.define(
    'Jogador',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: { msg: 'O nome é obrigatório' },
          notEmpty: { msg: 'O nome não pode ser vazio' },
          len: { args: [2, 100], msg: 'O nome deve ter entre 2 e 100 caracteres' },
        },
      },
      posicao: {
        type: DataTypes.ENUM(...POSICOES),
        allowNull: false,
        validate: {
          notNull: { msg: 'A posição é obrigatória' },
          isIn: { args: [POSICOES], msg: 'Posição inválida. Use G, Z, M ou A' },
        },
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'jogadores',
    }
  );

  Jogador.associate = (models) => {
    // 1 jogador -> N treinos
    Jogador.hasMany(models.Treino, { foreignKey: 'jogadorId', as: 'treinos' });
  };

  Jogador.POSICOES = POSICOES;
  return Jogador;
};
