const BaseModel = require('../db/models/index');
const { Op } = BaseModel.Sequelize;
const Feedback = require('../lib/Feedback');
const {
  createData,
  updateData,
  deleteData,
  dataExists,
  isEmpty,
  validatePayroll,
} = require('../lib/helpers');
const Pager = require('../lib/Pager');
const Sanitizer = require('../lib/Sanitizer');
const {
  generateErrorFeedback,
  generateAuthErrorFeedback,
  generateFormErrorFeedack,
  generatePermissionErrorFeedback,
} = require('../lib/models/ErrorHandler');
const { GetAuthUser } = require('../lib/AuthManager');
const { createPayroll } = require('../lib/models/Payroll');
const Model = 'Payroll';

exports.getPayrolls = async (req, res, next) => {
  let feedback;
  let page = Number(req.query.page) || 1;
  let paginate = req.query.paginate === 'false' ? false : true;
  let limit = Number(req.query.limit) || 20;
  let { searchquery } = req.query;

  try {
    let filter = {};
    if (searchquery) {
      filter[Op.or] = [
        {
          title: {
            [Op.like]: `%${searchquery}%`,
          },
        },
      ];
    }

    let pager = new Pager(Model, limit, page);
    feedback = await pager.getData(
      filter,
      [],
      [['createdAt', 'ASC']],
      paginate
    );
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }

  res.json(feedback);
};

exports.getPayroll = async (req, res, next) => {
  let { id } = req.params;
  let feedback;

  try {
    let payroll = await BaseModel.Payroll.findByPk(id);
    feedback = new Feedback(payroll, true, 'success');
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
};

exports.savePayroll = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let payrollData = createPayroll(formData);
      let errors = {};
      validatePayroll(errors, payrollData);
      if (isEmpty(errors)) {
        // ok
        let titleExists = await dataExists(Model, {
          title: payrollData.title,
        });
        if (titleExists)
          return res.send(
            new Feedback(null, false, `${payrollData.title} already exists`)
          );
        feedback = await createData(Model, payrollData);
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

exports.updatePayroll = async (req, res, next) => {
  let { formData, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization);
  let feedback;
  if (authUser) {
    try {
      let payrollData = createPayroll(formData);
      let errors = {};
      validatePayroll(errors, payrollData, true);
      if (isEmpty(errors)) {
        // ok
        feedback = await updateData(Model, payrollData, {
          id: payrollData.id,
        });
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

exports.deletePayroll = async (req, res, next) => {
  let { id, authorization } = Sanitizer.sanitize(req.body);
  let authUser = GetAuthUser(authorization) || true;
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
