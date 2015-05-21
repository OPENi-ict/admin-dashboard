var request = require('request');
var jwt     = require('jsonwebtoken');
var crud    = require('../libs/crud');
var config  = require('../libs/config');

var express = require('express');
var router  = express.Router();



router.get('/list_types', function(req, res)
{
   jwt.verify(req.signedCookies.session, config.key.verify, function (err, decoded) {

      if (err) {
         res.render('/admin/login')
      }
      else {
         var selectedCloudlet = req.query.selected

         var start = encodeURIComponent("[\"" + decoded.cloudlet + "\", \"" + selectedCloudlet + "\"]")
         var end   = encodeURIComponent("[\"" + decoded.cloudlet + "\", \"" + selectedCloudlet + "^\"]")

         var view_url = 'http://localhost:8092/objects/_design/objects_views/_view/object_by_third_party_type?startkey=' + start + '&endkey=' + end + '&group_level=3&stale=false&limit=100'

         crud.get(view_url, function(err, body){

            if (undefined !== err && null !== err){

               res.setHeader('Content-Type', 'application/json');
               res.end({"error": err});
            }
            else{

               var arr = []

               var body = JSON.parse(body)

               for (var i = 0; i < body.rows.length; i++){
                  arr.push(body.rows[i].key[2])
               }

               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify(arr));
            }

         })
      }
   })

});



router.put('/persist_app_perms', function(req, res)
{
   jwt.verify(req.signedCookies.session, config.key.verify, function (err, decoded) {

      if (err) {
         res.render('/admin/login')
      }
      else {
         var data = req.body

         var path = 'https://localhost:8443/api/v1/app_permissions/'

         crud.crud("PUT", path, data, function(err, body){

            if (err){
               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify({error : err }));
               return false
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(body));

         },req.signedCookies.session)
      }
   })

});


router.get('/list_service_enablers', function(req, res)
{

   var view_url = "http://localhost:8092/clients/_design/clients_views/_view/list_service_enablers?inclusive_end=false&reduce=false&stale=update_after&connection_timeout=60000&limit=100&skip=0"

   crud.get(view_url, function(err, body){


      if (undefined !== err && null !== err){

         res.setHeader('Content-Type', 'application/json');
         res.end({"error": err});
      }
      else{
         var body = JSON.parse(body)

         var se_list = []

         if (undefined !== body.rows){
            for (var i = 0; i < body.rows.length; i++){
               var se = body.rows[i]
               se_list.push({
                  "name"        : se.value.name,
                  "description" : se.value.description,
                  "cloudlet"    : se.value.cloudlet
               })
            }
         }

         res.setHeader('Content-Type', 'application/json');
         res.end(JSON.stringify(se_list));
      }

   })

});

module.exports = router;
