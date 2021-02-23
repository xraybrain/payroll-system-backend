exports.Login = class {
  constructor(email = null, password = null, userType = null, id = null) {
    if (email) this.email = email;
    if (password) this.password = password;
    if (userType) this.userType = userType;
    if (id) this.id = id;
  }
};

exports.createLogin = (formData = {}) => {
  return new this.Login(
    formData.email,
    formData.password,
    formData.userType,
    formData.id
  );
};
