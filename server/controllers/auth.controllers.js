const BaseModel = require('../db/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Feedback = require('../lib/Feedback');
require('dotenv').config();
const { Constants } = require('../lib/models/Constants');

module.exports.login = async (req, res, next) => {
  let { email, password } = req.body;
  const model = 'Login';
  let redirectURL;

  try {
    let authUser = await BaseModel[model].findOne({
      where: {
        email,
      },
    });

    let feedback;

    if (!authUser) {
      feedback = new Feedback(
        null,
        false,
        'Wrong username and password combination.'
      );
      return res.json(feedback);
    }

    // verify password
    let isMatch = bcrypt.compareSync(password, authUser['password']);
    if (!isMatch) {
      feedback = new Feedback(
        null,
        false,
        'Wrong username and password combination.'
      );
      return res.json(feedback);
    }

    //TODO: determine redirect url via userType
    redirectURL = '/admin/dashboard/';

    let token = jwt.sign(
      {
        login: authUser['id'],
        userType: authUser['userType'],
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h',
      }
    );

    feedback = new Feedback({ token, redirectURL }, true, 'success');
    res.json(feedback);
  } catch (error) {
    console.log(error);
    feedback = new Feedback(null, false, 'server error');
    res.json(feedback);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  const auth = req.headers.authorization || req.query.authorization;
  let feedback;
  let model = 'User';

  if (!auth) {
    feedback = new Feedback(null, false, 'you are not logged in.');
    return res.json(feedback);
  }

  token = auth.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      feedback = new Feedback(null, false, 'Failed to authenticate token');
      return res.json(feedback);
    }

    if (Date.now() / 1000 > decoded['exp']) {
      feedback = new Feedback(null, false, 'Expired Login Token');
      return res.json(feedback);
    }

    let userType = decoded['userType'];
    let id = decoded['login'];

    try {
      let user = await BaseModel.Staff.findOne({
        where: {
          loginId: id,
        },
        include: Constants.staffIncludes,
      });
      feedback = new Feedback(user, true, 'success');
      return res.json(feedback);
    } catch (error) {
      console.log(error);
      feedback = new Feedback(null, false, 'we were unable to process request');
      res.json(feedback);
    }
  });
};
