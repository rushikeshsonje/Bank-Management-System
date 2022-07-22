const Customer = require('../src/models/customer')
const Employee = require('../src/models/employees')
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')


exports.getIndex = (req, res, next) => {
    res.render('index', {
        message: '',
        // fails: ''
        hasError: null,
        hasError2: null,
        validationErrors2: [],
        validationErrors: [],
        oldInput: {
            email: '',
            password: ''
        }
    });
}; 

exports.postEmployeeLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.render('index', {
            message: errors.array()[0].msg,
            // message: ''
            hasError: true,
            hasError2: false, 
            validationErrors2: [],
            validationErrors: errors.array(),
            oldInput: {
                email: email,
                password: password
            }
        });
    }
    Employee.findOne({
        email: email
    }).then(user => {
        if(!user) {
            return res.render('index', {
                message: 'User Not Found',
                // message: ''
                hasError: true,
                hasError2: false, 
                validationErrors: [],
                validationErrors2: [],
                oldInput: {
                    email: email,
                    password: password
                }
            });
        }
        bcrypt
            .compare(password, user.password)
            .then(doMatch => {
                if(doMatch) {
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/employee')
                    })
                }
                return res.render('index', {
                    message: 'Invalid Email Or Password',
                    // message: ''
                    hasError: true,
                    hasError2: false, 
                    validationErrors: [],
                    validationErrors2: [],
                    oldInput: {
                        email: email,
                        password: password
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.redirect('/')
            })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getCustomerLogin = (req, res) => {
    // console.log(req.user1._id);
    Customer.find({'_id': req.user1._id})
    .then(user => {
        // console.log(user);
        // console.log(user[0].name);
        // console.log(user);
        res.render("customer", {
            message: req.flash('message'),
            message1: req.flash('message1'),
            user: user
        })
    })
}

exports.postCustomerLogin = (req, res) => {
    const email = req.body.customeremail;
    const password = req.body.customerpass;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.render('index', {
            message: errors.array()[0].msg,
            // message: ''
            hasError: false,
            hasError2: true,
            validationErrors: [],
            validationErrors2: errors.array(),
            oldInput: {
                customeremail: email,
                customerpass: password
            }
        });
    }
    Customer.findOne({
        email: email
    }).then(user => {
        if(!user) {
            return res.render('index', {
                message: 'User Not Found',
                // message: ''
                hasError: false,
                hasError2: true,
                validationErrors: [],
                validationErrors2: [],
                oldInput: {
                    customeremail: email,
                    customerpass: password
                }
            });
        }
        bcrypt
            .compare(password, user.password)
            .then(doMatch => {
                if(doMatch) {
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/customer')
                    })
                }
                return res.render('index', {
                    message: 'Invalid Email Or Password',
                    // message: ''
                    hasError: false,
                    hasError2: true,
                    validationErrors: [],
                    validationErrors2: [],
                    oldInput: {
                        customeremail: email,
                        customerpass: password
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.redirect('/')
            })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
  };


//   <%= hasError ? 'false': 'true' %>

// <%= hasError ? 'true': 'false' %>