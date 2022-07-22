const express = require('express');
// const path = require('path');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const { check , body } = require('express-validator')
const Employee = require('../src/models/employees')
const Customer = require('../src/models/customer')

const employeeRoutes = require('../controller/employee')

router.get('/employee', employeeRoutes.getEmployeeLogin)

router.post('/employee-addcustomer',
isAuth,
[   check('name', "Please Enter a Valid Name With Text Only!")
    .isLength({ mix: 30 }),
    // .isAlpha(),
    check('email')
    .isEmail()
    .withMessage('Please Enter a Valid Email Address!')
    .custom((value, {req}) => {
        return Customer.findOne({ email: value })
        .then(userDoc => {
          // console.log(userDoc);
          if (userDoc) {
            return Promise.reject('E-Mail exists already, Please pick a Different One!')
          }
        })
    }),
    body('password', 'Please Enter a Password with only numbers and text and at least 5 characters.')
    .isLength({min: 5})
    .isAlphanumeric(),
    body('confirmPassword')
    .custom((value, {req}) => {
        if( value !== req.body.password) {
            throw new Error('Password Are not Matching!')
        }
        return true;
    }),
    body('mobileno', 'Please Enter a Valid Mobile Number!')
    .isNumeric(),
    body('dob', "Please Enter a Valid Date Of Birth")
    .isDate(),
    body('state', "Please Enter a Valid State")
    .custom((value, {req}) => {
      if (value === 'Select State') {
        throw new Error('Please Select a State!')
      }
      return true;
    }),
    body('gender', "Please Enter a Valid Gender")
    .custom((value, {req}) => {
      if (value === 'Select Gender') {
        throw new Error('Please Select A Gender!')
      }
      return true;
    }),
    body('accno')
    .isNumeric({ min: 4 , max: 6})
    .withMessage('Account No is Valid Between only 4 to 6 Digits!')
    .custom((value, {req}) => {
      return Customer.findOne({ accno: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('Account No. exists already, Please pick a Different One!')
          }
        })
    })
],
employeeRoutes.postEmployeeAddCustomer)
    
router.post('/employee-findaccount',isAuth, employeeRoutes.postFindAccount)

router.post('/employee-addemployee',
isAuth,
[   check('name', "Please Enter a Valid First Name With Text Only!")
    .isLength({ max: 30 }),
    // .isAlpha(),
    check('email')
    .isEmail()
    .withMessage('Please Enter a Valid Email Address!')
    .custom((value, {req}) => {
        // if (value === 'rushikesh77sonje@gmail.com') {
        //     throw new Error('This email address is forbidden!')
        // }
        // return true;
        return Employee.findOne({ email: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail exists already, please pick a different one!')
          }
        })
    }),
    body('password', 'Please Enter a Password with only numbers and text and at least 5 characters.')
    .isLength({min: 5})
    .isAlphanumeric(),
    body('confirmPassword')
    .custom((value, {req}) => {
        if( value !== req.body.password) {
            throw new Error('Password Are not Matching!')
        }
        return true;
    })
],
employeeRoutes.postEmployeeAddEmployee)

router.post('/employee-removecustomer',isAuth, employeeRoutes.postRemoveCustomer);

router.post('/employee-creditfund',isAuth, employeeRoutes.postCreditFund);

router.post('/employee-debitfund',isAuth, employeeRoutes.postDebitFund);

router.post('/employee-transferfund',isAuth, employeeRoutes.postTransferFund);

module.exports = router;
