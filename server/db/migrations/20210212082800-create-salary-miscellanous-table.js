module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SalaryMiscellanous', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      mixedId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: true
      },
      miscId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Miscellanous',
          key: 'id',
        },
      },
      salaryId: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Salaries',
          key: 'id',
        },
      },
      subTotalAmount: {
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
    return queryInterface.dropTable('SalaryMiscellanous');
  },
};
