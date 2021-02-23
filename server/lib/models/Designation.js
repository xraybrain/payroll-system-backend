exports.Designation = class {
  constructor(name = null, deptId = null, id = null) {
    if (name) this.name = name;
    if (deptId) this.deptId = deptId;
    if (id) this.id = id;
  }
};

exports.createDesignation = (formData = {}) => {
  return new this.Designation(formData.name, formData.deptId, formData.id);
};
