const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
} = require('../lib/helpers');
const Pager = require('../lib/Pager');
const Sanitizer = require('../lib/Sanitizer');
const {
  generateErrorFeedback,
  generateAuthErrorFeedback,
  generatePermissionErrorFeedback,
} = require('../lib/models/ErrorHandler');
const { GetAuthUser } = require('../lib/AuthManager');
const { Constants } = require('../lib/models/Constants');
const { calculateSalary } = require('../lib/salary.helper');
const { createSalary } = require('../lib/models/Salary');
const { createStaff } = require('../lib/models/Staff');
const Model = 'Salary';

exports.getSalaries = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 20;
  let { searchquery, fromDate, toDate, pid, orderby } = req.query;
  let orderBy = [];
  let staffOrderBy = [];
  orderby = orderby || '';

  try {
    let filter = {};
    let staffFilter = {};
    if (searchquery) {
      staffFilter[Op.or] = [
        {
          surname: {
            [Op.like]: `%${searchquery}%`,
          },
        },
        {
          firstname: {
            [Op.like]: `%${searchquery}%`,
          },
        },
        {
          othername: {
            [Op.like]: `%${searchquery}%`,
          },
        },
      ];
    }

    if (fromDate && toDate) {
      filter.createdAt = {
        [Op.gte]: fromDate,
        [Op.lte]: toDate,
      };
    }

    filter.payrollId = pid;

    switch (orderby.toLowerCase()) {
      case 'bank':
        staffOrderBy.push(['bankId', 'ASC']);
        break;
      default:
        orderBy.push(['createdAt', 'DESC']);
        break;
    }

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      [
        {
          model: BaseModel.Staff,
          include: Constants.staffIncludes,
          where: staffFilter,
        },
        {
          model: BaseModel.SalaryMiscellanous,
          include: [
            {
              model: BaseModel.Miscellanous,
            },
          ],
        },
      ],
      [['bankId', 'ASC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.calculatePayroll = async (req, res, next) => {
  const transaction = await BaseModel.sequelize.transaction();
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let payrollId = formData.payrollId;
      await updateData(
        'Payroll',
        { status: 1 },
        { id: payrollId },
        null,
        transaction
      );
      let miscellanous = await BaseModel.Miscellanous.findAll({});
      let staffs = await BaseModel.Staff.findAll({
        where: {
          dateOfRet: {
            [Op.gt]: new Date(),
          },
        },
      });

      // calculate salary of each staff of insert in to db
      for (let staff of staffs) {
        let calculated = await calculateSalary(staff, miscellanous, payrollId);
        let salaryData = calculated.salary;
        let salaryMisc = calculated.salaryMisc;

        console.log(salaryMisc);

        // check if staff salary has been  calculated previously
        let alreadyCalculated = await BaseModel.Salary.findOne(
          {
            where: { staffId: staff.id, payrollId },
          },
          { transaction }
        );

        if (alreadyCalculated) {
          //-- recalculated: update
          feedback = await updateData(
            'Salary',
            salaryData,
            { staffId: staff.id, payrollId },
            null,
            transaction
          );
        } else {
          //-- just calculated: insert
          feedback = await createData('Salary', salaryData, null, transaction);
        }

        if (feedback.success) {
          if (salaryMisc.length > 0) {
            for (let misc of salaryMisc) {
              misc.salaryId = feedback.result.id;
              misc.mixedId = Number(`${misc.miscId}${misc.salaryId}`);
            }

            feedback = await createData(
              'SalaryMiscellanous',
              salaryMisc,
              null,
              transaction,
              true,
              ['subTotalAmount']
            );
          }
        } else {
          break;
        }
      }
      if (feedback.success) {
        //-- commit transaction
        await transaction.commit();
        //-- feedback
        feedback = new Feedback([], true, 'success');
      }
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generatePermissionErrorFeedback();
  }
  res.json(feedback);
};

exports.updateSalary = async (req, res, next) => {
  const transaction = await BaseModel.sequelize.transaction();
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;

  if (authUser) {
    try {
      let salaryData = createSalary(formData);
      let staff = createStaff(formData.Staff);
      let miscellanous = formData.Miscellanous;
      let { salary, salaryMisc } = await calculateSalary(
        staff,
        miscellanous,
        salaryData.payrollId
      );
      salary.status = salaryData.status;

      for (let misc of salaryMisc) {
        misc.salaryId = salaryData.id;
        misc.mixedId = Number(`${misc.miscId}${misc.salaryId}`);
      }

      //-- recalculated: update
      feedback = await updateData(
        'Salary',
        salary,
        { id: salaryData.id },
        null,
        transaction
      );

      if (feedback.success) {
        feedback = await createData(
          'SalaryMiscellanous',
          salaryMisc,
          null,
          transaction,
          true,
          ['subTotalAmount']
        );
      }

      if (feedback.success) {
        //-- commit transaction
        await transaction.commit();
        //-- feedback
        feedback = new Feedback(
          await BaseModel.Salary.findOne({
            where: { id: salaryData.id },
            include: [
              {
                model: BaseModel.Staff,
                include: Constants.staffIncludes,
              },
              {
                model: BaseModel.SalaryMiscellanous,
                include: [
                  {
                    model: BaseModel.Miscellanous,
                  },
                ],
              },
            ],
          }),
          true,
          'success'
        );
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  } else {
    feedback = generatePermissionErrorFeedback();
  }
  res.json(feedback);
};

exports.deleteSalary = async (req, res, next) => {
  let { id, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  try {
    if (authUser) {
      result = await deleteData(Model, {
        field: 'id',
        value: id,
      });

      feedback = new Feedback(result, true, 'deleted successfully.');
      feedback.message = Boolean(feedback.result)
        ? feedback.message
        : 'no data was deleted';
    } else {
      feedback = generateAuthErrorFeedback();
    }
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};
