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
      "client_id"        : client.name,
      "context"          : client.cloudlet,
      "scope"            : "openi",
      "openi-token-type" : "token",
      "response_type"    : "id_token"
   };

   return 'Bearer ' + jwt.sign(t, config.key.sign, { algorithm: 'RS256'})
}


module.exports = function (cmd_args) {
   return function (req, res, next) {
      res.render('typeRegistry');
   };
};

