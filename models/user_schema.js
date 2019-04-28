var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const format = require("node.date-time");
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validator');


var user = new Schema({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    dateOfReg: {
      type: Date,
      default: new Date().format("Y-MM-dd HH:mm:SS")
    },
    createdIpAddress: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    lastLogin: [{
      type: Date,
      default: null
    }],
    loginIpAddress: [{
      type: String,
      default: null
    }]
})

//to validate and send err if value is not unique
user.plugin(mongooseUniqueValidator);

//export models
module.exports = mongoose.model('UserDetails',user)
//module.exports = UserDetail;
