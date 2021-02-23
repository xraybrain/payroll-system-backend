exports.Staff = class {
  constructor(
    loginId = null,
    deptId = null,
    dsgId = null,
    classId = null,
    salaryStrId = null,
    bankId = null,
    level = null,
    grade = null,
    surname = null,
    firstname = null,
    othername = null,
    gender = null,
    dateOfEmp = null,
    dateOfRet = null,
    accountNo = null,
    imageUrl = null,
    id = null
  ) {
    if (loginId) this.loginId = loginId;
    if (deptId) this.deptId = deptId;
    if (dsgId) this.dsgId = dsgId;
    if (classId) this.classId = classId;
    if (salaryStrId) this.salaryStrId = salaryStrId;
    if (bankId) this.bankId = bankId;
    if (level) this.level = level;
    if (grade) this.grade = grade;
    if (surname) this.surname = surname;
    if (firstname) this.firstname = firstname;
    if (othername) this.othername = othername;
    if (gender) this.gender = gender;
    if (dateOfEmp) this.dateOfEmp = dateOfEmp;
    if (dateOfRet) this.dateOfRet = dateOfRet;
    if (accountNo) this.accountNo = accountNo;
    if (imageUrl) this.imageUrl = imageUrl;
    if (id) this.id = id;
  }
};

exports.createStaff = (formData = {}) => {
  let imageUrl;
  if (process.env.NODE_ENV === 'production' && formData.uploadURL) {
    imageUrl = formData.uploadURL || null;
  } else if (formData.fileName) {
    imageUrl = `/assets/uploads/${formData.fileName}`;
  } else {
    imageUrl = formData.imageUrl;
  }
  return new this.Staff(
    formData.loginId,
    formData.deptId,
    formData.dsgId,
    formData.classId,
    formData.salaryStrId,
    formData.bankId,
    formData.level,
    formData.grade,
    formData.surname,
    formData.firstname,
    formData.othername,
    formData.gender,
    formData.dateOfEmp,
    formData.dateOfRet,
    formData.accountNo,
    imageUrl,
    formData.id
  );
};
