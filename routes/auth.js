const express = require('express');
const router = express.Router();

const { check , body} = require('express-validator')

// const path = require('path');

const authRoutes = require('../controller/auth')

router.get('/', authRoutes.getIndex)

router.post('/employee', 
[
    check('email')
    .isEmail()
    .withMessage('Please Enter A valid Email!!'),
    body('password', 'Please Enter a valid Password!')
    .isLength({ min: 5})
    .isAlphanumeric()
], 
authRoutes.postEmployeeLogin);

router.get('/customer', authRoutes.getCustomerLogin);

router.post('/customer',
[
    check('customeremail')
    .isEmail()
    .withMessage('Please Enter A valid Email!!'),
    body('customerpass', 'Please Enter a valid Password!')
    .isLength({ min: 5})
    .isAlphanumeric()
],  authRoutes.postCustomerLogin);

router.post('/logout', authRoutes.postLogout);

module.exports = router;


// <!-- <div class="errormessage container d-flex justify-content-center mt-3">
// <div class="row mt-5 w-50">
// <% if(fails.length> 0) { %>
//     <div class="alert text-center alert-danger">
//         <%= fails %>
//     </div>
//     <% } %>
// </div>
// </div> -->