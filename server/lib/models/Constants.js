const BaseModel = require('../../db/models/index');
exports.Constants = class Constants {
  static DepartmentInclude = [
    {
      model: BaseModel.Designation,
      order: [[{ model: BaseModel.Designation }, 'name', 'ASC']],
    },
  ];

  static staffIncludes = [
    {
      model: BaseModel.Login,
    },
    {
      model: BaseModel.Department,
    },
    {
      model: BaseModel.Designation,
    },
    {
      model: BaseModel.StaffClass,
    },
    {
      model: BaseModel.SalaryStructure,
    },
    {
      model: BaseModel.Bank,
    },
  ];

  static getSalaryInclude(order = [['surname', 'ASC']]) {
    return [
      {
        model: BaseModel.Staff,
        include: Constants.staffIncludes,
        order,
      },
      {
        model: BaseModel.SalaryMiscellanous,
        include: [
          {
            model: BaseModel.Miscellanous,
          },
        ],
      },
    ];
  }

  static SalaryInclude = [
    {
      model: BaseModel.Staff,
      include: Constants.staffIncludes,
      order: [['surname', 'ASC']]
    },
    {
      model: BaseModel.SalaryMiscellanous,
      include: [
        {
          model: BaseModel.Miscellanous,
        },
      ],
    },
  ];
};
