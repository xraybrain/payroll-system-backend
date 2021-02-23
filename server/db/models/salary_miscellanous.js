module.exports = (sequelize, DataTypes) => {
  const SalaryMiscellanous = sequelize.define(
    'SalaryMiscellanous',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      mixedId: { type: DataTypes.INTEGER },
      miscId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'miscellanous',
          key: 'id',
        },
      },
      salaryId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'salaries',
          key: 'id',
        },
      },
      subTotalAmount: { type: DataTypes.DECIMAL(8, 2) },
    },
    {
      paranoid: true,
    }
  );

  SalaryMiscellanous.associate = (models) => {
    models.SalaryMiscellanous.belongsTo(models.Miscellanous, {
      foreignKey: 'miscId',
      model: 'miscellanous',
    });
    models.SalaryMiscellanous.belongsTo(models.Salary, {
      foreignKey: 'salaryId',
      model: 'salaries',
    });
  };

  return SalaryMiscellanous;
};
