module.exports = (sequelize, DataTypes) => {
  const Salary = sequelize.define(
    'Salary',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      staffId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'staffs',
          key: 'id',
        },
      },
      bankId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'banks',
          key: 'id',
        },
      },
      payrollId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'payrolls',
          key: 'id',
        },
      },
      status: { type: DataTypes.STRING },
      consolidated: { type: DataTypes.DECIMAL(8, 2) },
      grossPay: { type: DataTypes.DECIMAL(8, 2) },
      totalDeducted: { type: DataTypes.DECIMAL(8, 2) },
      netPay: { type: DataTypes.DECIMAL(8, 2) },
    },
    {
      paranoid: true,
    }
  );

  Salary.associate = (models) => {
    models.Salary.belongsTo(models.Staff, {
      foreignKey: 'staffId',
      model: 'staffs',
    });
    models.Salary.belongsTo(models.Bank, {
      foreignKey: 'bankId',
      model: 'banks',
    });
    models.Salary.belongsTo(models.Payroll, {
      foreignKey: 'payrollId',
      model: 'payrolls',
    });
    models.Salary.hasMany(models.SalaryMiscellanous, {
      foreignKey: 'salaryId',
      model: 'salarymiscellous',
    });
  };

  return Salary;
};
