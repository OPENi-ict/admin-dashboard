var request  = require('request');
var jwt      = require('jsonwebtoken');
var crud     = require('../libs/crud');
var auth     = require('../libs/auth');
var config   = require('../libs/config');


var express = require('express');
var router  = express.Router();


var apiKeyExtract = new RegExp(/[a-z,0-9]{32}/m);

module.exports = function (cmd_args) {

   var admin_dash_public_key = cmd_args.auth_server_public_key.replace(/'/g, "").replace(/"/g, '').replace(/\\n/g, "\n");

   return function (req, res, next) {

      jwt.verify(req.signedCookies.session, admin_dash_public_key, function (err, decoded) {

         if ( err ) {
            res.render('/admin/login')
         }
         else {
            auth.readClients(req.signedCookies.session, function (err, body) {
               var match = apiKeyExtract.exec(req.baseUrl)

               var app_api_key = (null !== match && match.length > 0 ) ? match[0] : ''

               var client = {}

               for ( var k in body.result ) {
                  if ( app_api_key === body.result[k].api_key ) {
                     client = body.result[k]
                  }
               }

               auth.readAppPermissions(req.signedCookies.session, app_api_key, function (err, data) {

                  var new_data = {result : []}

                  for ( var i = 0; i < data.result.length; i++ ) {

                     var e = data.result[i]

                     if (i >= 1){
                        continue
                     }

                     for ( var j = 0; j < e.permissions.length; j++ ) {
                        if ( null !== data.result[i].permissions[j] ) {
                           delete data.result[i].permissions[j].cloudlet
                           delete data.result[i].permissions[j].app_id
                        }
                     }

                     if ( undefined !== e.service_enablers && null !== e.service_enablers ) {
                        for ( var j = 0; j < e.service_enablers.length; j++ ) {
                           if ( null !== data.result[i].service_enablers[j] ) {
                              delete data.result[i].service_enablers[j].cloudlet
                              delete data.result[i].service_enablers[j].app_id
                           }
                        }
                     }
                     else {
                        data.result[i].service_enablers = []
                     }

                     new_data.result.push(data.result[i])
                  }

                  res.render('permissions', {
                     user         : decoded.user_id,
                     'c'          : client,
                     'p'          : new_data,
                     'session'    : req.signedCookies.session,
                     'app_api_key': app_api_key
                  });
               })
            });
         }
      });
   };
};

