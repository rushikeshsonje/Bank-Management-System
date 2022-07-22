const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    employeedetails: {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref:'Employee',
            required: true
        },
        employeename: {
            type: String,
            required: true
        },
        employeeemail: {
            type: String,
            required: true
        }
    }
})

const Employee = new mongoose.model("Employee", employeeSchema)

module.exports = Employee;