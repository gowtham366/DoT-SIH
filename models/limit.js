var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const format = require("node.date-time");

var limit = new Schema({
    limit: {
        type: Number,
        required: true
    },
    dateOfSetting: {
        type: Date,
        default: new Date().format("Y-MM-dd HH:mm:SS")
    },
    createdUser: {
        type: String,
        required: true
    },
    createdIpAddress: {
        type: String,
        required: true
    }   
})

module.exports = mongoose.model('limitDetails',limit)