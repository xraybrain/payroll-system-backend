module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define(
    'Payroll',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      title: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Payroll.associate = (models) => {
    models.Payroll.hasMany(models.Salary, {
      foreignKey: 'payrollId',
      model: 'staffs',
    });
  };

  return Payroll;
};
