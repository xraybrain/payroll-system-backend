const router = require('express').Router();
const {
  login,
  getCurrentUser,
  resetPassword,
} = require('../controllers/auth.controllers');

router.post('/auth/login/', login);
router.get('/auth/user/', getCurrentUser);
router.post('/auth/reset/password/', resetPassword);

module.exports = router;
