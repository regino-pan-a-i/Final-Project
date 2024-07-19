const {body, validationResult} = require('express-validator');
const validator = require('../utilites/tripHelper');
validate = {};

 validate.saveTrip = (req, res, next) => {
  const validationRule = {
    destination: 'required|string',
    startDate: 'required|string',
    endDate: 'required|string'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

validate.saveAcm = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    address: 'required|string',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

validate.saveAct = (req, res, next) => {
    const validationRule = {
      name: 'required|string',
      type: 'required|string',
      date: 'required|string',
      time: 'required|string',
    };
    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(412).send({
          success: false,
          message: 'Validation failed',
          data: err
        });
      } else {
        next();
      }
    });
  };




module.exports = validate;