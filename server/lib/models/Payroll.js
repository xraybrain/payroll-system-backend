exports.Payroll = class {
  constructor(title = null, status = null, id = null) {
    if (title) this.title = title;
    if (status) this.status = status;
    if (id) this.id = id;
  }
};

exports.createPayroll = (formData = {}) => {
  return new this.Payroll(formData.title, formData.status, formData.id);
};
