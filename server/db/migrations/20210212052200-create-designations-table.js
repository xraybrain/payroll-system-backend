module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Designations', {
      id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      deptId: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        references: {
          model: 'Departments',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING(100),
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
    return queryInterface.dropTable('Designations');
  },
};
