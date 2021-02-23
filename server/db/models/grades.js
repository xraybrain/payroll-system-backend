module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define('Grade', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
  });

  Grade.associate = (models) => {
    models.Grade.hasMany(models.Staff, {
      foreignKey: 'grade',
      model: 'staffs',
    });
  };

  return Grade;
};
