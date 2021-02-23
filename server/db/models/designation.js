module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define(
    'Designation',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      deptId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'departments',
          key: 'id',
        },
      },
      name: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Designation.associate = (models) => {
    models.Designation.hasMany(models.Staff, {
      foreignKey: 'dsgId',
      model: 'staffs',
    });
    models.Designation.belongsTo(models.Department, {
      foreignKey: 'deptId',
      model: 'departments',
    });
  };
  return Designation;
};
