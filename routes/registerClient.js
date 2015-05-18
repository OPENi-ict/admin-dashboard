var request = require('request');
var auth    = require('../libs/auth');
var express = require('express');
var jwt     = require('jsonwebtoken');
var config  = require('../libs/config');
var router  = express.Router();

router.get('/', function(req, res){
   jwt.verify(req.signedCookies.session, config.key.verify, function (err, decoded) {

      if (err) {
         res.render('/admin/login')
      }
      else {
         res.render('registerClient', {user : decoded.user_id});
      }
   });
});

router.post('/', function(req, res)
{
   jwt.verify(req.signedCookies.session, config.key.verify, function (err, decoded) {

      if (err) {
         res.render('/admin/login')
      }
      else {
         if(!req.body.clientname || !req.body.cdescription) {
            // pass a local variable to the view
            res.render('registerClient', { message: 'Please insert a client name and description.' }, function(err, html) {
               res.send(html);
            });
            return;
         }
         auth.createClient(req.body.clientname, req.body.cdescription, req.body.cisSE, req.signedCookies.session, function(err, body) {
            res.redirect('apps');
         });
      }
   });
});

module.exports = router;
