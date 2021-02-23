const router = require('express').Router();
const BaseModel = require('../db/models/index');
const Feedback = require('../lib/Feedback');
const { generateErrorFeedback } = require('../lib/models/ErrorHandler');

router.get('/levels/', async (req, res, next) => {
  let feedback;
  try {
    let levels = await BaseModel.Level.findAll({});
    feedback = new Feedback(levels, true, 'success');
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
});
router.get('/grades/', async (req, res, next) => {
  let feedback;
  try {
    let grades = await BaseModel.Grade.findAll({});
    feedback = new Feedback(grades, true, 'success');
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
});

router.get('/staff/classes/', async (req, res, next) => {
  let feedback;
  try {
    let staffClasses = await BaseModel.StaffClass.findAll({});
    feedback = new Feedback(staffClasses, true, 'success');
  } catch (error) {
    feedback = generateErrorFeedback(error);
  }
  res.json(feedback);
});

module.exports = router;
