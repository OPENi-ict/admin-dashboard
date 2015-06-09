/**
 * Created by dconway on 09/06/15.
 */

var wrap = function(args){


   var express = require('express');
   var router  = express();

   var index = require('./index')(args);

   // Simple_Auth
   var register        = require('./register')(args);
   var login           = require('./login')(args);
   var logout          = require('./logout')(args);
   var registerClient  = require('./registerClient')(args);
   var typesBuilder    = require('./typeBuilder')(args);
   var apps            = require('./apps')(args);
   var permissions     = require('./permissions')(args);
   var mockauth        = require('./mockauth')(args);
   var addpermissions  = require('./addpermissions')(args);
   var typeRegistry    = require('./typeRegistry')(args);
   var data            = require('./data')(args);
   var subscriptions   = require('./subscriptions')(args);
   var addSubscription = require('./addSubscription')(args);
   var aggregator      = require('./aggregator')(args);
   var ajax            = require('./ajax')(args);


   router.use('/register',          register);
   router.use('/',                  index);
   router.use('/login',             login);
   router.use('/login',             login);
   router.use('/logout',            logout);
   router.use('logout',             logout);
   router.use('/dashboard',         index);
   router.use('/registerClient',    registerClient);
   router.use('/data',              data);
   router.use('/typeBuilder',       typesBuilder);
   router.use('/apps',              apps);
   router.use('/permissions*',      permissions);
   router.use('/addpermissions*',   addpermissions);
   router.use('/mockauth*',         mockauth);
   router.use('/subscriptions*',    subscriptions);
   router.use('/addSubscription',   addSubscription);
   router.use('/typeRegistry',      typeRegistry);
   router.use('/aggregator',        aggregator);
   router.use('/ajax',              ajax);

   return router
}


module.exports = wrap;
