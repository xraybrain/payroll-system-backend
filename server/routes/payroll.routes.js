const router = require('express').Router();

const {
  getPayrolls,
  getPayroll,
  savePayroll,
  updatePayroll,
  deletePayroll,
} = require('../controllers/payroll.controllers');

const {
  getSalaries,
  calculatePayroll,
  updateSalary,
  deleteSalary,
  salarySummary,
} = require('../controllers/salary.controller');

router.get('/payrolls/', getPayrolls);
router.get('/payroll/:id', getPayroll);
router.post('/payrolls/', savePayroll);
router.put('/payrolls/', updatePayroll);
router.delete('/payrolls/', deletePayroll);

router.get('/payrolls/salaries/', getSalaries);
router.post('/payrolls/salaries/', calculatePayroll);
router.put('/payrolls/salaries/', updateSalary);
router.delete('/payrolls/salaries/', deleteSalary);
router.get('/payrolls/salaries/summary', salarySummary);
module.exports = router;
