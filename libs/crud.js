var request = require('request');

//var base = 'https://' + '127.0.0.1' + ':443/api/v1/crud';
//var base = 'https://demo2.openi-ict.eu:443/api/v1/crud';
var host = 'https://demo2.openi-ict.eu';
var base = '/api/v1/crud';

function crud(method, uri, body, authorization, cb)
{
	var postData = '';
	if(body) postData = body.stringify;

	var options = {
		host: host,
		port: 443,
		path: uri,
		method: method,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
	    	'Content-Length': postData.length,
	    	'Authorization': authorization
	  	}
	};

	var req = https.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');

		res.on('data', function (chunk) {
	    	console.log('AUTH-BODY: ' + chunk);
	  	});
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write(postData);
	req.end();
}

/*function crud(method, uri, body, cb)
{
	request({
		method: method,
		uri: uri,
		json: body,
		headers: {'Authorization': '29f81fe0-3097-4e39-975f-50c4bf8698c7'},
		strictSSL: false
	}, function (err, res, body)
	{
		if(body && body.error)
			err = body.error;
		cb(err, body);
	});
}*/

function create(db, json, cb)
{
	crud('POST', base + '/' + db, json, cb);
}

function createNamed(db, id, json, cb)
{
	crud('POST', base + '/' + db + '/' + id, json, cb);
}

function read(db, id, cb)
{
	crud('GET', base + '/' + db + '/' + id, null, cb);
}

function update(db, id, json, cb)
{
	crud('PUT', base + '/' + db + '/' + id, json, cb);
}

function remove(db, id, cb)
{
	crud('DELETE', base + '/' + db + '/' + id, null, cb);
}

function patch(db, id, json, cb)
{
	crud('PATCH', base + '/' + db + '/' + id, json, cb);
}

function upsert(db, id, json, cb)
{
	crud('POST', base + '/upsert/' + db + '/' + id, json, cb);
}

function query(query, cb)
{
	crud('POST', base + '/query', query, cb);
}

module.exports.create = create;
module.exports.createNamed = createNamed;
module.exports.read = read;
module.exports.update = update;
module.exports.remove = remove;
module.exports.patch = patch;
module.exports.upsert = upsert;
module.exports.query = query;
module.exports.base = base;