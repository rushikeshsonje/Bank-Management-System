const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    mobileno: {
        type: Number,
        required: true,
        unique: true
    },
    adharno: {
        type: Number,
        required: true,
        unique: true
    },
    dob: {
        type: String,
        required: true
    },
    accno: {
        type: Number,
        required: true,
        unique: true
    },
    accbalance: {
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    employeedetails: {
        employeename: {
            type: String,
            required: true
        },
        employeeemail: {
            type: String,
            required: true
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref:'Employee',
            required: true
        }
    }
})

const Customer = new mongoose.model("Customer", customerSchema)

module.exports = Customer;