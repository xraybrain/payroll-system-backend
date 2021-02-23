const router = require('express').Router();
const {
  getStaffs,
  saveStaff,
  updateStaff,
  deleteStaff,
  userDashboard,
} = require('../controllers/staff.controllers');
const uploader = require('../services/formidable')({
  uploadDir: '../../client/src/assets/uploads',
});

router.get('/staffs/', getStaffs);
router.post('/staffs/', uploader, saveStaff);
router.put('/staffs/', updateStaff);
router.delete('/staffs/', deleteStaff);
router.get('/staffs/dashboard', userDashboard);

module.exports = router;
