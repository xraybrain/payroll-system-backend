module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define(
    'Bank',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      name: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Bank.associate = (models) => {
    models.Bank.hasMany(models.Staff, {
      foreignKey: 'bankId',
      model: 'staffs',
    });
  };

  return Bank;
};
