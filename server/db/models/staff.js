module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    'Staff',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      loginId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'logins',
          key: 'id',
        },
      },
      deptId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'departments',
          key: 'id',
        },
      },
      dsgId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'designations',
          key: 'id',
        },
      },
      classId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'staffclasses',
          key: 'id',
        },
      },
      salaryStrId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'salarystructures',
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
      surname: { type: DataTypes.STRING },
      firstname: { type: DataTypes.STRING },
      othername: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      dateOfEmp: { type: DataTypes.DATE }, // date of employment
      dateOfRet: { type: DataTypes.DATE }, // date of retirement
      accountNo: { type: DataTypes.STRING },
      imageUrl: { type: DataTypes.STRING },
    },
    {
      paranoid: true,
    }
  );

  Staff.associate = (models) => {
    models.Staff.belongsTo(models.Login, {
      foreignKey: 'loginId',
      model: 'logins',
    });
    models.Staff.belongsTo(models.Department, {
      foreignKey: 'deptId',
      model: 'departments',
    });
    models.Staff.belongsTo(models.Designation, {
      foreignKey: 'dsgId',
      model: 'designations',
    });
    models.Staff.belongsTo(models.StaffClass, {
      foreignKey: 'classId',
      model: 'staffclasses',
    });
    models.Staff.belongsTo(models.SalaryStructure, {
      foreignKey: 'salaryStrId',
      model: 'salarystructures',
    });
    models.Staff.belongsTo(models.Bank, {
      foreignKey: 'bankId',
      model: 'banks',
    });
  };

  return Staff;
};
