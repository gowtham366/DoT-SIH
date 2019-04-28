var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var appRoutes = require('./routes/app');
const user = require('./routes/users');
const subscriber = require('./routes/subscribers');
const tspRoutes = require('./routes/tsps');
const dotRoutes = require('./routes/dot');
const tspLogin = require('./routes/tspLogin');
var app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/dot');
//mongoose.connect('mongodb://gowtham:password@ds221339.mlab.com:21339/dot');


mongoose.connection.on('connected', function () {
  console.log('DB connected!!!');
});
mongoose.connection.on('error', function (err) {
  console.log('Error in Mongoose connection: ', err);
});

mongoose.connection.on('disconnected', function () {
   console.log('Mongoose is now disconnected..!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/', appRoutes);
app.use('/user', user );
app.use('/subscriber', subscriber);
app.use('/tsp', tspRoutes);
app.use('/dot', dotRoutes);
app.use('/tspService', tspLogin);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.render('index');
});


module.exports = app;
