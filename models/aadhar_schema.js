var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const format = require("node.date-time");
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validator');

//creating schema
var mobileDetails = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  operator: {
      type: String,
      required: true
  },
  dateOfReg: {
    type: Date,
    required: true
  },
  region: {
      type: String,
      required: true
  },
  dropStatus:{
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String,
    required: true
  }
})

/* schema for Aadhar */
var aadharSchema = new Schema({
  aadharNumber: {
    type : Number,
    required : true,
    unique: true
  },
  name:{
    type : String,
    required : true,
  },
  MobileDetails: [mobileDetails],
  lastLogin: [{
    type: String,
    default: null
  }]
});

aadharSchema.plugin(mongooseUniqueValidator);
mobileDetails.plugin(mongooseUniqueValidator);
//creating model
const subscriberDetail = mongoose.model('AadharDetails', aadharSchema);
//export schema
module.exports = subscriberDetail;
