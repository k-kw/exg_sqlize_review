var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');

var signoutRouter = require('./routes/auth/signout');
var signinRouter = require('./routes/auth/signin');
var signupRouter = require('./routes/auth/signup');

var reviewC_Router = require('./routes/review/create');
var reviewL_Router = require('./routes/review/list');
var reviewUL_Router = require('./routes/review/user_list');
var reviewE_Router = require('./routes/review/edit');
var reviewD_Router = require('./routes/review/del');
var reviewA_Router = require('./routes/review/add_from_target');
var reviewTL_Router = require('./routes/review/list_from_target');

var targetS_Router = require('./routes/target/search');

var userP_Router = require('./routes/user/profile');

var topRouter = require('./routes/top');
var usertopRouter = require('./routes/usertop');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

require("./config/passport")(app);

app.use('/signout', signoutRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);

app.use('/review/create', reviewC_Router);
app.use('/review/list', reviewL_Router);
app.use('/review/user_list', reviewUL_Router);
app.use('/review/edit', reviewE_Router);
app.use('/review/del', reviewD_Router);
app.use('/review/add_from_target', reviewA_Router);
app.use('/review/list_from_target', reviewTL_Router);

app.use('/target/search', targetS_Router);

app.use('/user/profile', userP_Router);

app.use('/top', topRouter);
app.use('/usertop', usertopRouter);
app.use('/', topRouter)



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
