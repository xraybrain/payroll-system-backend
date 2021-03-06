const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
  dataExists,
  isEmpty,
  validateStaff,
} = require('../lib/helpers');
const Pager = require('../lib/Pager');
const Sanitizer = require('../lib/Sanitizer');
const {
  generateErrorFeedback,
  generateAuthErrorFeedback,
  generateFormErrorFeedack,
  generatePermissionErrorFeedback,
} = require('../lib/models/ErrorHandler');
const { createStaff, Staff } = require('../lib/models/Staff');
const { GetAuthUser } = require('../lib/AuthManager');
const { Constants } = require('../lib/models/Constants');
const { excelReader } = require('../services/excel-reader');
const Model = 'Staff';

exports.getStaffs = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 20;
  let { searchquery, dateofemp, dateofret } = req.query;

  try {
    let filter = {};
    if (searchquery) {
      filter[Op.or] = [
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

    if (dateofemp) {
      filter.dateOfEmp = dateofemp;
    }

    if (dateofret) {
      filter.dateOfRet = dateofret;
    }

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      Constants.staffIncludes,
      [['surname', 'ASC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.saveStaff = async (req, res, next) => {
  let feedback = req.body;
  if (feedback.success) {
    try {
      let { formData, uploadURL, fileName } = feedback.result;
      formData = JSON.parse(formData);
      formData.fileName = fileName || uploadURL;
      formData.imageUrl = '/assets/avatar.png';

      let staffData = createStaff(formData);
      let errors = {};
      validateStaff(errors, staffData);
      if (isEmpty(errors)) {
        //ok
        // check if salary structure has level and grade
        let structureExists = await dataExists('SalaryStructureList', {
          level: staffData.level,
          grade: staffData.grade,
          structureId: staffData.salaryStrId,
        });

        if (!structureExists)
          return res.json(
            new Feedback(
              null,
              false,
              'The selected level and grade does not match any salary in the structure list'
            )
          );

        // create staff
        feedback = await createData(Model, staffData, Constants.staffIncludes);
      } else {
        feedback = generateFormErrorFeedack(errors);
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  }

  res.json(feedback);
};

exports.saveStaffsUpload = async (req, res, next) => {
  let feedback = req.body;
  if (feedback.success) {
    try {
      let { formData, uploadURL, fileName } = feedback.result;
      if (formData) formData = JSON.parse(formData);
      let staffsJSON = excelReader(uploadURL);
      let staffsData = [];
      let errors = {};

      // console.log(staffsJSON);
      let index = 0;
      for (let rawStaff of staffsJSON.Sheet1) {
        let salaryStructure = await BaseModel.SalaryStructure.findOne({
          where: { shortName: rawStaff.SalaryStructure },
        });
        let dept = await BaseModel.Department.findOne({
          where: { name: rawStaff.Department },
        });
        let dsg = await BaseModel.Designation.findOne({
          where: { name: rawStaff.Designation },
        });
        let bank = await BaseModel.Bank.findOne({
          where: { name: rawStaff.Bank },
        });
        let staffClass = await BaseModel.StaffClass.findOne({
          where: { name: rawStaff.Class },
        });

        errors[
          `${index}`
        ] = `${rawStaff.Surname} ${rawStaff.Firstname} ${rawStaff.Othername}`;

        if (salaryStructure) {
          let structureExists = await dataExists('SalaryStructureList', {
            level: rawStaff.Level,
            grade: rawStaff.Grade,
            structureId: salaryStructure.id,
          });

          let accountNoExists = await dataExists('Staff', {
            accountNo: rawStaff.AccountNo,
          });

          if (accountNoExists)
            errors[
              `${index}`
            ] += `, account no. [${rawStaff.AccountNo}] already exists`;

          if (structureExists) {
            if (!dept)
              errors[
                `${index}`
              ] += `, department [${rawStaff.Department}] does not exists`;

            if (!dsg)
              errors[
                `${index}`
              ] += `, designation [${rawStaff.Designation}] does not exists`;

            if (!bank)
              errors[`${index}`] += `, bank [${rawStaff.Bank}] does not exists`;

            if (!staffClass)
              errors[
                `${index}`
              ] += `, class [${rawStaff.Class}] does not exists`;

            if (dept && dsg && bank && staffClass && !accountNoExists) {
              delete errors[`${index}`];
              staffsData.push(
                new Staff(
                  null,
                  dept.id,
                  dsg.id,
                  staffClass.id,
                  salaryStructure.id,
                  bank.id,
                  rawStaff.Level,
                  rawStaff.Grade,
                  rawStaff.Surname,
                  rawStaff.Firstname,
                  rawStaff.Othername,
                  rawStaff.Gender,
                  rawStaff.DateOfEmp,
                  rawStaff.DateOfRet,
                  rawStaff.AccountNo,
                  '/assets/avatar.png'
                )
              );
            }
          } else {
            errors[
              `${index}`
            ] += `,level and grade [${rawStaff.Level}, ${rawStaff.grade}] does not match any annual salary in the salary structure.`;
          }
        } else {
          errors[
            `${index}`
          ] += ` salary structure [${rawStaff.SalaryStructure}] does not exists`;
        }

        ++index;
      }

      console.log(Object.values(errors));

      console.log(staffsData);
      feedback = await createData('Staff', staffsData, [], null, true);

      if (!isEmpty(errors)) {
        feedback = new Feedback(
          Object.values(errors),
          false,
          'Operation failed'
        );
      }
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  }

  res.json(feedback);
};

exports.updateStaff = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let staffData = createStaff(formData);
      let errors = {};
      validateStaff(errors, staffData, true);
      if (isEmpty(errors)) {
        // ok
        feedback = await updateData(
          Model,
          staffData,
          {
            id: staffData.id,
          },
          Constants.staffIncludes
        );
      } else {
        feedback = generateFormErrorFeedack(errors);
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

exports.updateStaffPassport = async (req, res, next) => {
  let feedback = new Feedback(null, false, 'failed');
  feedback = req.body;
  if (feedback.success) {
    try {
      let { formData, uploadURL, fileName } = feedback.result;
      formData = JSON.parse(formData);
      formData.fileName = fileName || uploadURL;
      let staffData = createStaff(formData);

      feedback = await updateData(
        'Staff',
        staffData,
        { id: formData.id },
        Constants.staffIncludes
      );
    } catch (error) {
      console.log(error);
      feedback = generateErrorFeedback(error);
    }
  } 
  res.json(feedback);
};

exports.deleteStaff = async (req, res, next) => {
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

exports.userDashboard = async (req, res, next) => {
  let feedback;
  let { authorization } = req.query;
  let authUser = GetAuthUser(authorization);
  try {
    if (authUser) {
      let d = new Date();
      let from = `${d.getFullYear()}-1-1`;
      let to = `${d.getFullYear()}-2-31`;
      let totalStaff = await BaseModel.Staff.count();
      let totalDepts = await BaseModel.Department.count();
      let totalBanks = await BaseModel.Bank.count();
      let payrolls = await BaseModel.Payroll.findAll({
        order: [['createdAt', 'DESC']],
      });
      let monthlySalaries = 0.0;
      let bankSchedule = [];

      // calculate annual payroll
      let annualPayroll = await BaseModel.Salary.findAll({
        attributes: [
          'createdAt',
          [
            BaseModel.Sequelize.fn('sum', BaseModel.Sequelize.col('netPay')),
            'totalNetPay',
          ],
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(from),
            [Op.lte]: new Date(to),
          },
        },
        group: ['payrollId'],
      });
      // calculate annual payroll

      if (payrolls.length > 0) {
        let payroll = payrolls[0];
        monthlySalaries = await BaseModel.Salary.sum('netPay', {
          where: { payrollId: payroll.id },
        });

        // Last Payroll Bank Schedule
        bankSchedule = await BaseModel.Salary.findAll({
          attributes: [
            'bankId',
            [
              BaseModel.Sequelize.fn('sum', BaseModel.Sequelize.col('netPay')),
              'totalNetPay',
            ],
          ],
          where: {
            payrollId: payroll.id,
          },
          include: { model: BaseModel.Bank },
          group: ['bankId'],
        });
        // Last Payroll Bank Schedule
      }

      feedback = new Feedback(
        {
          totalStaff,
          totalBanks,
          totalDepts,
          monthlySalaries,
          annualPayroll,
          bankSchedule,
        },
        true,
        'success'
      );
    } else {
      feedback = generateAuthErrorFeedback();
    }
  } catch (error) {
    console.log(error);
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};
