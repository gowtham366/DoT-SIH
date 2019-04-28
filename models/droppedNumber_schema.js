var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const format = require("node.date-time");
var mongooseUniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validator');
//creating schema
var mobileDetails = new Schema({
  number: {
    type: Number,
    required: true
  },
  operator: {
      type: String,
      required: true
  },
  dateOfDropped: {
    type: Date,
    default: new Date().format("Y-MM-dd HH:mm:SS")
  },
  region: {
      type: String,
      required: true
  },
  dropStatus: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
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
  MobileDetails: [mobileDetails]
});

aadharSchema.plugin(mongooseUniqueValidator);
//mobileDetails.plugin(mongooseUniqueValidator);
//creating model
const droppedDetail = mongoose.model('DroppedNumbers', aadharSchema);
//export schema
module.exports = droppedDetail;
