const router = require('express').Router();
const {
  getStaffs,
  saveStaff,
  updateStaff,
  deleteStaff,
  userDashboard,
  saveStaffsUpload,
} = require('../controllers/staff.controllers');
const uploader = require('../services/formidable')({
  uploadDir: '../../client/src/assets/uploads',
});

const staffUploader = require('../services/formidable')({
  uploadDir: '../temp',
});

router.get('/staffs/', getStaffs);
router.post('/staffs/', uploader, saveStaff);
router.post('/staffs/upload/', staffUploader, saveStaffsUpload);
router.put('/staffs/', updateStaff);
router.delete('/staffs/', deleteStaff);
router.get('/staffs/dashboard', userDashboard);

module.exports = router;
