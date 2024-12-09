var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./database/db')
const methodOverride = require('method-override');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var aboutRouter = require('./routes/about');
var dashRouter = require('./routes/dashboard');
var EmployeeRouter = require('./routes/Employeelist');
// var CreateEmployeeRouter = require('./routes/CreateEmployee');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//layout setup
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.use(methodOverride('_method'));
// Body parser middleware (for form data)
app.use(express.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname,  '/uploads')));
const session = require('express-session');

// session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/about', aboutRouter);
app.use('/dashboard', indexRouter);
app.use('/logout', indexRouter);
// app.use('/Employeelist', EmployeeRouter);
// app.use('/CreateEmployee', CreateEmployeeRouter);

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
