const bcrypt = require('bcryptjs');

const Customer = require('../src/models/customer')
const Employee = require('../src/models/employees')

const { validationResult } = require('express-validator')

exports.getEmployeeLogin = function (req, res) {
    // console.log(req.user1._id);
    Employee.find({'_id': req.user._id})
    .then(user => {
        // console.log(user);
        // console.log(user[0].name);
        res.render("employee", {
            message: req.flash('message'),
            message1: req.flash('message1'),
            user: user,
            oldInput: {
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            },
            oldInputCustomer: {
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                mobileno: "",
                adharno: "",
                dbo: "",
                accbalance: "",
                address: "",
                state: "",
                district: "",
                city: "",
                gender: ""
            },
            hasError: null,
            hasError2: null,
            validationErrors: []   
            // isAuthenticated: req.isLoggedIn
        })
    })
};

exports.postFindAccount = (req, res, next) => {
    const accno = req.body.accno;
    Customer.findOne({accno: accno})
    .then(user => {
        // console.log(user);
        // console.log(user.firstname);
        if(!user) {
            req.flash('message1', 'Enter Valid Account Number!!')
            return res.redirect('/employee')
        }
        return res.render('finduser', {
            user: user
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postEmployeeAddCustomer = (req, res, next) => {
    const name1 = req.body.name
    const email1 = req.body.email;
    const password1 = req.body.password;
    const mobileno = req.body.mobileno;
    const adharno = req.body.adharno;
    const dob = req.body.dob;
    const accno = req.body.accno;
    const accbalance = req.body.accbalance;
    const address = req.body.address;
    const state = req.body.state;
    const district = req.body.district;
    const city = req.body.city;
    const gender = req.body.gender;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return Employee.find({'_id': req.user._id})
        .then(user => {
            // console.log(user);
            res.status(422).render("employee", {
                message: '',
                message1: errors.array()[0].msg,
                user: user,
                oldInput: {
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                },
                oldInputCustomer: {
                    name: name1,
                    email: email1,
                    password: password1,
                    confirmPassword: req.body.password,
                    mobileno: mobileno,
                    adharno: adharno,
                    dbo: dob,
                    accbalance: accbalance,
                    address: address,
                    state: state,
                    district: district,
                    city: city,
                    gender: gender
                },
                hasError2: null,
                hasError: true,
                validationErrors: errors.array()
            // isAuthenticated: req.isLoggedIn
            })
        }) 
    }
    // Customer.findOne({email: email})
    // .then(userDoc => {
    //     if(userDoc)
    //     return res.redirect('/employee')
    // })
    bcrypt
        .hash(password1, 12)
        .then(hashpassword => {
            const registerCustomer = new Customer({
                name: name1,
                email: email1,
                password: hashpassword,
                mobileno: mobileno,
                adharno: adharno,
                dob: dob,
                accno: accno,
                accbalance: accbalance,
                address: address,
                state: state,
                district: district,
                city: city,
                gender: gender,
                employeedetails: {
                    employeename: req.user.name,
                    employeeemail: req.user.email,
                    employeeId: req.user
                }
            })
        return registerCustomer.save()
    }) 
    .then(result => {
        req.flash('message', 'Customer Added Successfully.')
        res.redirect('/employee')
    })
    .catch (err=> {
        // req.flash('message1', 'Enter Correct Information.')
        // console.log(err);
        // return res.status(400).redirect("/employee") 
        return Employee.find({'_id': req.user._id})
        .then(user => {
            return res.status(422).render("employee", {
                message: '',
                message1: 'Enter Correct Information!',
                user: user,
                oldInput: {
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                },
                oldInputCustomer: {
                    name: name1,
                    email: email1,
                    password: password1,
                    confirmPassword: req.body.password,
                    mobileno: mobileno,
                    adharno: adharno,
                    dbo: dob,
                    accbalance: accbalance,
                    address: address,
                    state: state,
                    district: district,
                    city: city,
                    gender: gender
                },
                hasError2: null,
                hasError: true,
                validationErrors: []
                // isAuthenticated: req.isLoggedIn
            })
        })
    })
}


exports.postEmployeeAddEmployee = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return Employee.find({'_id': req.user._id})
        .then(user => {
            res.status(422).render("employee", {
                message: '',
                message1: errors.array()[0].msg,
                user: user,
                oldInputCustomer: {
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    mobileno: "",
                    adharno: "",
                    dbo: "",
                    accbalance: "",
                    address: "",
                    state: "",
                    district: "",
                    city: "",
                    gender: ""
                },
                oldInput: {
                    name: name,
                    email: email,
                    password: password,
                    confirmPassword: req.body.password
                },
                hasError: null,
                hasError2: true,
                validationErrors: errors.array()
            // isAuthenticated: req.isLoggedIn
            })
        })
    }
    // Employee.findOne({email: email})
    // .then(userDoc1 => {
    //     // console.log(userDoc);
    //     if(userDoc1){
    //         req.flash('message1', 'Enter Correct info')
    //         return res.redirect('/employee')
    //     }
    // })
    bcrypt
        .hash(password, 12)
        .then(hashpassword1 => {
            const registerEmployee = new Employee({
            name: name,
            email: email,
            password: hashpassword1,
            employeedetails: {
                employeename: req.user.name,
                employeeemail: req.user.email,
                employeeId: req.user
            }
        })
        return registerEmployee.save()
    }) 
    .then(result => {
        req.flash('message', 'Customer Added Successfully.')
        res.redirect('/employee')
    })
    .catch (err=> {
        req.flash('message1', 'Enter Correct Information.')
        console.log(err);
        return res.status(400).redirect("/employee") 
    })
}
// exports.getCustomer = async (req, res) => {
//     try{
//         res.render('customer')
//     } catch (err) {
//         console.log(err);
//     }
// }

exports.postRemoveCustomer = async (req, res) => {
    const accno = req.body.accno;
    Customer
    .findOne({accno: accno})
    .then(user => {
        console.log(user);
        if(!user) {
            req.flash('message1', 'User Not Found.')
            return res.status(400).redirect("/employee")
        }
        Customer.deleteOne(user, function(err, obj) {
            if (err) throw err;
        })
        req.flash('message', 'Customer Removed Successfully!')
        res.redirect('/employee')
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postCreditFund = async (req, res) => {
    try {
        const accountno = await Customer.findOne({
            accno: req.body.accno
        })
        const ammount = req.body.ammount;
        const updatecreditfund = async (_id) => {
            try {
                const result = await Customer.updateOne({
                    _id
                }, {
                    $inc: {
                        accbalance: ammount
                    }
                })
                // console.log(result)
            } catch (err) {
                console.log(err);
            }
        }
        updatecreditfund(accountno._id)
        req.flash('message', 'Fund Credited Successfully!')
        res.status(201).redirect("/employee")
    } catch (e) {
        req.flash('message1', 'Enter Valid Account Number!')
        res.status(400).redirect("/employee")
    }
}

exports.postDebitFund = async (req, res) => {
    try {
        const accountno = await Customer.findOne({
            accno: req.body.accno
        })
        const ammount = req.body.ammount;
        if (accountno.accbalance > ammount) {
            const updatedebitfund = async (_id) => {
                try {
                    const result = await Customer.updateOne({
                        _id
                    }, {
                        $inc: {
                            accbalance: -ammount
                        }
                    })
                } catch (err) {
                    console.log(err);
                }
            }
            updatedebitfund(accountno._id)
            req.flash('message', 'Fund Debited Successfully!')
            res.status(201).redirect("/employee")
        } else {
            req.flash('message1', 'Insufficient Balance!')
            res.status(201).redirect("/employee")
        }
    } catch (e) {
        req.flash('message1', 'Enter Valid Account Number!')
        res.status(400).redirect("/employee")
    }
}

exports.postTransferFund = async (req, res) => {
    try {
        const accountnofrom = await Customer.findOne({
            accno: req.body.fromaccno
        })
        const accountnoto = await Customer.findOne({
            accno: req.body.toaccno
        })
        const ammount = req.body.ammount;
        if (accountnofrom.accno != '' & accountnoto.accno != '') {
            if (accountnofrom.accbalance > ammount) {
                const updatedebitfund = async (_id) => {
                    try {
                        const result = await Customer.updateOne({
                            _id
                        }, {
                            $inc: {
                                accbalance: -ammount
                            }
                        })
                        // console.log(result)
                    } catch (err) {
                        console.log(err);
                    }
                }
                updatedebitfund(accountnofrom._id)             
                const updatecreditfund = async (_id) => {
                    try {
                        const result = await Customer.updateOne({
                            _id
                        }, {
                            $inc: {
                                accbalance: ammount
                            }
                        })
                        // console.log(result)
                    } catch (err) {
                        console.log(err);
                    }
                }
                updatecreditfund(accountnoto._id)
    
                req.flash('message', 'Fund Transfer Successfully.')
                res.status(201).redirect("/employee")
            } else {
                req.flash('message1', 'Insufficient Balance.')
                res.status(201).redirect("/employee")
            }
        }
        
    } catch (e) {
        req.flash('message1', 'Invalid Details.')
        res.status(201).redirect("/employee")
    }
}