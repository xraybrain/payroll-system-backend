module.exports = (sequelize, DataTypes) => {
  const SalaryStructure = sequelize.define(
    'SalaryStructure',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING },
      shortName: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  SalaryStructure.associate = (models) => {
    models.SalaryStructure.hasMany(models.Staff, {
      foreignKey: 'salaryStrId',
      model: 'staffs',
    });

    models.SalaryStructure.hasMany(models.SalaryStructureList, {
      foreignKey: 'structureId',
      model: 'salarystructurelists',
    });
  };

  return SalaryStructure;
};
