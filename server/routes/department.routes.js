const router = require('express').Router();
const {
  saveDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/department.controllers');
const {
  saveDesignation,
  updateDesignation,
  deleteDesignation,
} = require('../controllers/designation.controllers');

router.get('/departments/', getDepartments);
router.post('/departments/', saveDepartment);
router.put('/departments/', updateDepartment);
router.delete('/departments/', deleteDepartment);

router.post('/departments/designations/', saveDesignation);
router.put('/departments/designations/', updateDesignation);
router.delete('/departments/designations/', deleteDesignation);

module.exports = router;
