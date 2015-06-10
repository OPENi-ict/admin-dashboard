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

               for ( var i in body.result ) {
                  if ( app_api_key === body.result[i].api_key ) {
                     client = body.result[i]
                  }
               }

               res.render('addpermissions', {
                  user         : decoded.user_id,
                  'c'          : client,
                  'session'    : req.signedCookies.session,
                  'app_api_key': app_api_key
               });
            });
         }
      });


   };
};
