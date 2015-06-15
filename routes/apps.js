var request = require('request');
var jwt = require('jsonwebtoken');
var crud = require('../libs/crud');
var auth = require('../libs/auth');
var config = require('../libs/config');

var express = require('express');
var router = express.Router();

module.exports = function (cmd_args) {

   var admin_dash_public_key = cmd_args.auth_server_public_key.replace(/'/g, "").replace(/"/g, '').replace(/\\n/g, "\n");

   return function (req, res, next) {

      jwt.verify(req.signedCookies.session, admin_dash_public_key, function (err, decoded) {

         if ( err ) {
            res.render('/admin/login')
         }
         else {

            auth.readClients(req.signedCookies.session, function (err, body) {
               var apps = [];
               var se = [];

               if ( undefined !== body.result ) {
                  for ( var i = 0; i < body.result.length; i++ ) {
                     var e = body.result[i];
                     if ( e.isSE ) {
                        se.push(e)
                     }
                     else {
                        apps.push(e)
                     }
                  }
               }


               res.render('apps', { user: decoded.user_id, 'clients': apps, 'se': se });
            });
         }
      });
   };
};


