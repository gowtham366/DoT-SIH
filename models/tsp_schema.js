var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const format = require("node.date-time");
//format.formatter()
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validator');

var tsp = new Schema({
    operator: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    region:{
      type: String,
      required: true
    },
    authKey: {
      type: String,
      required: true,
      unique: true
    },
    dateOfReg: {
      type: Date,
      default: new Date().format("Y-MM-dd HH:mm:SS"),
      required: true
    },
    createdIpAddress: {
      type: String,
      required: true
    },
    lastLogin: [{
      type: Date,
      default: null
    }],
    isActive: {
      type: Boolean,
      default: false
    },
    loginIpAddress: [{
      type: String,
      default: null
    }]
});

//to validate and send err if value is not unique
tsp.plugin(mongooseUniqueValidator);

//export models
module.exports = mongoose.model('tspdetails',tsp)
//module.exports = UserDetail;
