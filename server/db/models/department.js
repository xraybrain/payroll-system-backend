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
  };

  return Department;
};
