///////////////////////////
//    GLOBA VARIABLES
///////////////////////////
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var HomeRouter = require('./routes/home');
var BlogRouter = require('./routes/blog');
var bodyParser = require('body-parser');
var Admin = require('./routes/admin');
var Accessor = require('./database/security');
var AdminPannel = require('./routes/adminPannel');
///////////////////////////
//      EXPRESS
///////////////////////////
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.set('env', 'production');
///////////////////////////
// ADDITIONAL MIDDLEWARE
//////////////////////////
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images_from_blog')));
app.use((req,res,next)=>{
  if(req.cookies.lang){
    req.lang = req.cookies.lang;
  }
  else{
    req.lang = "ru";
  }
next();
});
///////////////////////////
//    MY MIDDLEWAREKO
///////////////////////////
app.use('/', HomeRouter);
app.use('/blog', BlogRouter);
app.use('/admin',Admin);
app.use('/AdminPannel',Accessor,AdminPannel);
///////////////////////////
//    PAGE NOT FOUND 404
///////////////////////////
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
///////////////////////////
//      START SERVER 
///////////////////////////
var port = 8000;
app.listen(port,"0.0.0.0");
