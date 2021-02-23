module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Department.associate = (models) => {
    models.Department.hasMany(models.Staff, {
      foreignKey: 'deptId',
      model: 'staffs',
    });
    models.Department.hasMany(models.Designation, {
      foreignKey: 'deptId',
      model: 'designations',
    });
  };

  return Department;
};
