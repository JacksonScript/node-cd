var config = require('../../config.js');
var Netmask = require('netmask').Netmask
var crypto = require('crypto');

var authorizedSubnet =  config.security.authorizedSubnet.map(function(subnet){
	return new Netmask(subnet)
})

function signBlob (key, blob) {
	  return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex')
};

exports.index = function(req, res){
  res.json( { status: 'ok' });
};

exports.favicon = function(req, res){
  res.writeHead(404);
  res.end();
};

exports.github = function(req, res){
  authorizedIps = config.security.authorizedIps;
  var payload = req.body;
  console.log('From IP Address:', req.ip);
  console.log('payload', payload);
  if (payload && (inAuthorizedSubnet(req.ip) || authorizedIps.indexOf(req.ip) >= 0)) {
    var repository = payload.repository.name;
    var branch = payload.ref.replace('refs/heads/', '');
    if (config.repositories[repository].secret || req.headers['x-hub-signature']) {
	var signature = req.headers['x-hub-signature'];
        var key = config.repositories[repository].secret;
	var signed = signBlob(key, JSON.stringify(payload));
	console.log('sig',signature,signed)
	if (signature !== signed) {
		res.end();
	}
    }
    console.log('seeking', repository, branch)
    if (config.repositories[repository]
	&& config.repositories[repository][branch] 
	&& config.repositories[repository][branch].action ) {
	console.log('found '+repository+' branch '+branch)
	myExec(config.repositories[repository][branch].action.exec);
        res.writeHead(200);
    	res.end('success');
    } else {
    res.writeHead(200);
    res.end('no action for '+branch+' in '+repository);
  }
} else {
    res.writeHead(403);
  	res.end();
  }
};

var inAuthorizedSubnet = function(ip) {
	return authorizedSubnet.some(function(subnet) {
		return subnet.contains(ip)
	})
}

var myExec = function(line) {
    var exec = require('child_process').exec;
    var execCallback = function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      console.log(stdout);
    }
    var child = exec(line, execCallback);
}
