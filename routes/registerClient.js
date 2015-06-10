var request = require('request');
var auth    = require('../libs/auth');
var express = require('express');
var jwt     = require('jsonwebtoken');
var config  = require('../libs/config');
var router  = express.Router();

module.exports = function(cmd_args) {


   var seckeyenc              = cmd_args.seckeyenc
   var admin_dash_public_key = cmd_args.auth_server_public_key.replace(/'/g, "").replace(/"/g, '').replace(/\\n/g, "\n")

   router.get('/', function (req, res) {
      jwt.verify(req.signedCookies.session, admin_dash_public_key, function (err, decoded) {

         if ( err ) {
            res.render('/admin/login')
         }
         else {
            res.render('registerClient', { user: decoded.user_id });
         }
      });
   });

   router.post('/', function (req, res) {
      jwt.verify(req.signedCookies.session, admin_dash_public_key, function (err, decoded) {

         if ( err ) {
            res.render('/admin/login')
         }
         else {
            if ( !req.body.clientname || !req.body.cdescription ) {
               // pass a local variable to the view
               res.render('registerClient', { message: 'Please insert a client name and description.' }, function (err, html) {
                  res.send(html);
               });
               return;
            }
            console.log(req.body)
            var isSE = (undefined !== req.body.cisSE && 'on' === req.body.cisSE) ? true : false;
            auth.createClient(req.body.clientname, req.body.cdescription, isSE, req.signedCookies.session, function (err, body) {
               res.redirect('apps');
            });
         }
      });
   });


   return router;
};

