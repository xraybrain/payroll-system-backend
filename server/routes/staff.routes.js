const router = require('express').Router();
const {
  getStaffs,
  saveStaff,
  updateStaff,
  deleteStaff,
  userDashboard,
  saveStaffsUpload,
  updateStaffPassport,
} = require('../controllers/staff.controllers');
const uploader = require('../services/formidable');

const staffUploader = require('../services/formidable')({
  uploadDir: '../temp',
});

router.get('/staffs/', getStaffs);
router.post(
  '/staffs/',
  uploader({
    uploadDir: '../../client/src/assets/uploads',
    canSkipUpload: true,
  }),
  saveStaff
);
router.post('/staffs/upload/', staffUploader, saveStaffsUpload);
router.post(
  '/staffs/change/passport',
  uploader({
    uploadDir: '../../client/src/assets/uploads',
  }),
  updateStaffPassport
);
router.put('/staffs/', updateStaff);
router.delete('/staffs/', deleteStaff);
router.get('/staffs/dashboard', userDashboard);

module.exports = router;
