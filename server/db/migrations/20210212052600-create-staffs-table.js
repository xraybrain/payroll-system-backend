module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('staffs', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      loginId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Logins',
          key: 'id',
        },
      },
      deptId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Departments',
          key: 'id',
        },
      },
      dsgId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Designations',
          key: 'id',
        },
      },
      classId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'StaffClasses',
          key: 'id',
        },
      },
      salaryStrId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'SalaryStructures',
          key: 'id',
        },
      },
      bankId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'banks',
          key: 'id',
        },
      },
      loginId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Logins',
          key: 'id',
        },
      },
      level: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Levels',
          key: 'id',
        },
      },
      grade: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Grades',
          key: 'id',
        },
      },
      surname: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      firstname: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      othername: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      dateOfEmp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dateOfRet: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      accountNo: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING(500),
        defaultValue: '/assets/avatar.png',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('staffs');
  },
};
