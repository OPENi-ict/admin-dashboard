var request = require('request');

var base = 'https://' + '127.0.0.1' + ':443/api/v1/auth';
//var base = '/api/v1/auth';

function IsJsonString(str) {
   try {
      JSON.parse(str);
   } catch (e) {
      return false;
   }
   return true;
}

function crud(method, uri, body, authorization, cb)
{
	request({
		method: method,
		uri: uri,
		json: body,
		headers: (authorization != null ? {'Authorization': authorization} : {}),
		strictSSL: false
	}, function (err, res, body)
	{
		if(body && body.error) {
         err = body.error;
      }
      else{
         if (IsJsonString(body)){
            body = JSON.parse(body)
            cb(err, body);
         }
         else{
            cb(err, body);
         }
      }
	});
}

/* this endpoint is not supported anymore
function listAuthorizations(session)
{
	crud('GET', base + '/authorizations', null, session, cb);
}
*/


function createClient(clientname, cdescription, session, cb)
{
   crud('POST', base + '/clients', {'name': clientname, 'description': cdescription}, session, cb);
}

function readClients(session, cb)
{
   crud('GET', base + '/clients', null, session, cb);
}

function createSession(username, password, cb)
{
	crud('POST', base + '/sessions', {'username': username, 'password': password}, null, cb);
}

function deleteSession(session, cb)
{
	crud('DELETE', base + '/sessions', {'session': session}, null, cb);
}

function refreshSession(session, cb)
{
	crud('PUT', base + '/sessions', {'session': session}, null, cb);
}

function createUser(username, password, cb)
{
	crud('POST', base + '/users', {'username': username, 'password': password}, null, cb);
}

module.exports.createClient   = createClient;
module.exports.readClients    = readClients;
module.exports.createSession  = createSession;
module.exports.deleteSession  = deleteSession;
module.exports.refreshSession = refreshSession;
module.exports.createUser     = createUser;
module.exports.base           = base;