const { isDigit } = require('../Validator');

exports.SalaryMisc = class {
  constructor(
    mixedId = null,
    miscId = null,
    payrollId = null,
    salaryId = null,
    subTotalAmount = null,
    id = null
  ) {
    if (mixedId) this.mixedId = mixedId;
    if (miscId) this.miscId = miscId;
    if (salaryId) this.salaryId = salaryId;
    if (payrollId) this.payrollId = payrollId;
    if (isDigit(subTotalAmount)) this.subTotalAmount = subTotalAmount;
    if (id) this.id = id;
  }
};

exports.createSalaryMisc = (formData = {}) => {
  return new this.SalaryMisc(
    formData.mixedId,
    formData.miscId,
    formData.payrollId,
    formData.salaryId,
    formData.subTotalAmount,
    formData.id
  );
};
