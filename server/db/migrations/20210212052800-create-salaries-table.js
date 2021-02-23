module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Salaries', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      staffId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Staffs',
          key: 'id',
        },
      },
      bankId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Banks',
          key: 'id',
        },
      },
      payrollId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Payrolls',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      consolidated: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      grossPay: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      totalDeducted: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      netPay: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
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
    return queryInterface.dropTable('Salaries');
  },
};
