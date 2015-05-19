var request = require('request');
var jwt     = require('jsonwebtoken');
var crud    = require('../libs/crud');
var auth    = require('../libs/auth');
var config  = require('../libs/config');

var express = require('express');
var router  = express.Router();

router.get('/', function(req, res)
{
   jwt.verify(req.signedCookies.session, config.key.verify, function (err, decoded) {

      if (err) {
         res.render('/admin/login')
      }
      else {

         auth.readClients(req.signedCookies.session, function(err, body)
         {
            var apps = []
            var se   = []

            console.log (body)

            if (undefined !== body.result) {
               for (var i = 0; i < body.result.length; i++){
                  var e = body.result[i]
                  if (e.isSE){
                     se.push(e)
                  }
                  else{
                     apps.push(e)
                  }
               }
            }


            res.render('apps', {user : decoded.user_id, 'clients': apps, 'se' : se});
         });
      }
   });


});

module.exports = router;
