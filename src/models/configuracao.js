const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Configuracao = sequelize.define(
    'Configuracao',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      cargaMaximaSemanal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: 'A carga máxima semanal é obrigatória' },
          isDecimal: { msg: 'A carga máxima semanal deve ser numérica' },
          min: { args: [0.01], msg: 'A carga máxima semanal deve ser maior que zero' },
        },
      },
      dataVigencia: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: { isDate: { msg: 'Data de vigência inválida (use AAAA-MM-DD)' } },
      },
    },
    {
      tableName: 'configuracoes',
    }
  );

  return Configuracao;
};
