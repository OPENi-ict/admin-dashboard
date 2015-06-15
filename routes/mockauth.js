var request  = require('request');
var jwt      = require('jsonwebtoken');
var crud     = require('../libs/crud');
var auth     = require('../libs/auth');
var config   = require('../libs/config');
var uuid     = require('uuid');


var express = require('express');
var router  = express.Router();


var apiKeyExtract = new RegExp(/[a-z,0-9]{32}/m);


var getMockAuthToken = function(cid, client){

   var date = Math.floor((new Date()).getTime() / 1000);

   var t = {
      "jti"              : cid + '_' + uuid.v4(),
      "iss"              : "https://localhost/auth/token",
      "sub"              : cid,
      "exp"              : date + 432000,
      "iat"              : date,
      "nonce"            : uuid.v4(),
      "user_id"          : cid,
      "cloudlet"         : cid,
      "client_id"        : client.api_key,
      "client_name"      : client.name,
      "context"          : client.cloudlet,
      "scope"            : "openi",
      "openi-token-type" : "token",
      "response_type"    : "id_token"
   };

   return 'Bearer ' + jwt.sign(t, config.key.sign, { algorithm: 'RS256'})
}


module.exports = function (cmd_args) {

   var admin_dash_public_key = cmd_args.auth_server_public_key.replace(/'/g, "").replace(/"/g, '').replace(/\\n/g, "\n");

   return function (req, res, next) {

      jwt.verify(req.signedCookies.session, admin_dash_public_key, function (err, decoded) {

         var total = (undefined === req.query.total  ) ? 1 : req.query.total
         var persist = (undefined !== req.query.persist && 'true' === req.query.persist) ? true : false

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

               var mock_cloudlets = []

               for ( var i = 0; i < total; i++ ) {
                  var str = 'c_0000000000000000000000000000'
                  if ( i < 10 ) {
                     str += '000'
                  }
                  else if ( i < 100 ) {
                     str += '00'
                  }
                  else if ( i < 1000 ) {
                     str += '0'
                  }
                  else {
                     break;
                  }
                  str += i

                  mock_cloudlets.push({ 'id': str, 'token': getMockAuthToken(str, client) })
               }

               auth.readAppPermissions(req.signedCookies.session, app_api_key, function (err, data) {

                  var client_latest_perms = data.result[data.result.length - 1]

                  var success_function = function () {
                     res.render('mockauth', {
                        user            : decoded.user_id,
                        'c'             : client,
                        'mock_cloudlets': mock_cloudlets,
                        'total'         : total,
                        'pe'            : client_latest_perms,
                        'session'       : req.signedCookies.session,
                        'app_api_key'   : app_api_key
                     });
                  }

                  if ( persist ) {
                     //loop through the mock_cloudlets
                     //call POST permisssions endpoint for all of them
                     for ( var i = 0; i < mock_cloudlets.length; i++ ) {
                        var entry = mock_cloudlets[i]

                        auth.persistPermissionsForUserAndClient(entry.token, client_latest_perms, function (err, body) {
                           //console.log('err', err)
                           //console.log('body', body)
                        })

                     }
                     success_function()
                  }
                  else {
                     success_function()
                  }

               })
            });
         }
      });


   };
};

