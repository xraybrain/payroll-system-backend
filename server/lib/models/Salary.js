exports.Salary = class {
  constructor(
    staffId = null,
    bankId = null,
    payrollId = null,
    status = null,
    consolidated = null,
    grossPay = null,
    totalDeducted = null,
    netPay = null,
    id = null
  ) {
    if (staffId) this.staffId = staffId;
    if (bankId) this.bankId = bankId;
    if (payrollId) this.payrollId = payrollId;
    if (status) this.status = status;
    if (consolidated) this.consolidated = consolidated;
    if (grossPay) this.grossPay = grossPay;
    if (totalDeducted) this.totalDeducted = totalDeducted;
    if (netPay) this.netPay = netPay;
    if (id) this.id = id;
  }
};

exports.createSalary = (formData = {}) => {
  return new this.Salary(
    formData.staffId,
    formData.bankId,
    formData.payrollId,
    formData.status,
    formData.consolidated,
    formData.grossPay,
    formData.totalDeducted,
    formData.netPay,
    formData.id
  );
};
