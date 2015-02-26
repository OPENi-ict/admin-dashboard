var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var config = {
   trusted_public_key: '-----BEGIN PUBLIC KEY-----\n'+
   'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKT8kGk6ZNo3sC4IIo29leRLVD23T2r0\n'+
   'vWXBEkk2pV42HsxKAmPs789AGHH9XwbGpD7FvrcBWWgb65v32Hg/NGkCAwEAAQ==\n'+
   '-----END PUBLIC KEY-----'
}

/*****************************
*       IMPLEMENT ROUTES     *
*****************************/
// Overview Dashboard
var index = require('./routes/index');

// Simple_Auth
var register       = require('./routes/register');
var login          = require('./routes/login');
var logout         = require('./routes/logout');
var registerClient = require('./routes/registerClient');
var apps           = require('./routes/apps');


/*****************************
*        INITIALIZE APP      *
*****************************/
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('4e3d00e7-7fc4-480f-b785-bafebbdcb74f'));

/*app.use(session({
  secret: '4e3d00e7-7fc4-480f-b785-bafebbdcb74f',
  //resave: false,
  //saveUninitialized: true,
  //rolling: true,
  //unset: 'destroy',
  cookie: { secure: true, maxAge: 3600000, foo: '' }
}))*/

app.use(express.static(path.join(__dirname, 'public')));

// Authentification check
app.use('/admin', function(req, res, next){
   console.log(req.path)
  if(req.signedCookies.session || req.path === '/login' || req.path === '/register') {
    next();
  } else {
    res.redirect('/admin/login');
  }
});

app.use('/', login);

app.use('/admin/register',             register);
app.use('/admin',                      index(config));
app.use('/admin/login',                login);
app.use('/login',                      login);
app.use('/admin/logout',               logout);
app.use('/admin/dashboard',            index(config));
app.use('/admin/registerClient',       registerClient);
app.use('/admin/apps',                 apps);


//app.use('/register', register);
//app.use('/login', login);
//app.use('/logout', logout);
//
//app.use('/dashboard', index);
//
//app.use('/dashboard/registerClient', registerClient);
//
//app.use('/dashboard/apps', apps);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
