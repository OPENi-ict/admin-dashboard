var request  = require('request');
var jwt      = require('jsonwebtoken');
var crud     = require('../libs/crud');
var auth     = require('../libs/auth');
var subs     = require('../libs/subscriptions');
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

            subs.getOPENiSubscriptions(req.signedCookies.session, function (err, body) {

               //console.log(JSON.parse(body)['result']);

               if ( err ) {
                  console.log(err)
               }
               if ( body !== undefined || body !== null || body['result'].length !== 0) {
                  body = JSON.parse(body);
                  res.render('subscriptions', {
                     user     : decoded.user_id,
                     's'      : body['result'],
                     'session': req.signedCookies.session
                  });
               }
               else {
                  res.render('subscriptions', {
                     user     : decoded.user_id,
                     's'      : [],
                     'session': req.signedCookies.session
                  });
               }

            });
         }
      });


   };
};
