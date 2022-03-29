var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cloudinary = require('cloudinary').v2;


var indexRoute = require('./routes/index');
var votersRoute = require('./routes/voters');
var registerRoute = require('./routes/register');
var adminRoute = require('./routes/admin');
var schoolAdminRoute = require('./routes/schoolAdmin');
var loginRoute = require('./routes/login');
var pwRoute = require('./routes/forgotPassword');
require('dotenv').config();
var app = express();


mongoose.connect(process.env.mongoConnection, { useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
  if(err) {console.log(err)}
  else {console.log("Connected")}
});
// var db = mongoose.connection;
// db.once("open", callback => console.log("Connection Successful"));
// db.on("error", error => console.log(error));

// cloudinary.config({
//   cloud_name: 'realitypacefoundation',
//   api_key: '314139385432777',
//   api_secret: 'yRJpupmP_ZYimDgWimVFvnFQdhc',
//   secure: true
// });

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/v1/voters', votersRoute);
app.use('/v1/admin', adminRoute);
app.use('/v1/schooladmin', schoolAdminRoute);
app.use('/v1/register', registerRoute);
app.use('/v1/login', loginRoute);
app.use('/v1/forgotresetpw', pwRoute);
app.use('/v1/', indexRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
