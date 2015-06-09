var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var engines      = require('consolidate');

var wrap = function(args) {

   /*****************************
    *       IMPLEMENT ROUTES     *
    *****************************/
// Overview Dashboard
   var index = require('./routes/index')(args);

// Simple_Auth
   var register        = require('./routes/register');
   var login           = require('./routes/login');
   var logout          = require('./routes/logout');
   var registerClient  = require('./routes/registerClient');
   var typesBuilder    = require('./routes/typeBuilder');
   var apps            = require('./routes/apps');
   var permissions     = require('./routes/permissions');
   var mockauth        = require('./routes/mockauth');
   var addpermissions  = require('./routes/addpermissions');
   var typeRegistry    = require('./routes/typeRegistry');
   var data            = require('./routes/data');
   var subscriptions   = require('./routes/subscriptions');
   var addSubscription = require('./routes/addSubscription');
   var aggregator      = require('./routes/aggregator');
   var ajax            = require('./routes/ajax');


   /*****************************
    *        INITIALIZE APP      *
    *****************************/
   var app = express();

// view engine setup
   app.set('views', path.join(__dirname, 'views'));
//app.engine('jade', require('jade').__express);
//app.engine('html', require('ejs').renderFile);
//
//app.engine('haml', engines.haml);
//app.engine('html', engines.hogan);
   app.set('view engine', 'jade');

   app.engine('.ejs', require('ejs').renderFile);

//app.set('view engine', 'ejs');

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
   app.use('/admin', function (req, res, next) {
      if ( req.signedCookies.session || req.path === '/login' || req.path === '/register' || req.path === '/logout' ) {
         next();
      }
      else {
         res.redirect('/admin/login');
      }
   });

   app.use('/', login);

   app.use('/admin/register',          register);
   app.use('/admin',                   index);
   app.use('/admin/login',             login);
   app.use('/login',                   login);
   app.use('/admin/logout',            logout);
   app.use('logout',                   logout);
   app.use('/admin/dashboard',         index);
   app.use('/admin/registerClient',    registerClient);
   app.use('/admin/data',              data);
   app.use('/admin/typeBuilder',       typesBuilder);
   app.use('/admin/apps',              apps);
   app.use('/admin/permissions*',      permissions);
   app.use('/admin/addpermissions*',   addpermissions);
   app.use('/admin/mockauth*',         mockauth);
   app.use('/admin/subscriptions*',    subscriptions);
   app.use('/admin/addSubscription',   addSubscription);
   app.use('/admin/typeRegistry',      typeRegistry);
   app.use('/admin/aggregator',        aggregator);
   app.use('/admin/ajax',              ajax);


// catch 404 and forward to error handler
   app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
   });

// error handlers

// development error handler
// will print stacktrace
   if ( app.get('env') === 'development' ) {
      app.use(function (err, req, res, next) {
         res.status(err.status || 500);
         res.render('error', {
            message: err.message,
            error  : err
         });
      });
   }

// production error handler
// no stacktraces leaked to user
   app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error  : {}
      });
   });

   return app
};

module.exports = wrap;
