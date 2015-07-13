var util = require('util'),
	facepass = require('passport-facebook');


function Strategy(options, verify){
	options = options || {};

	facepass.call(this, options, verify);
	console.log(options);
}

util.inherits(Strategy, facepass);

Strategy.prototype.authenticate = function(req, options) {
	var self = this,
		oauth = this._oauth2,
  		token = req.query.token,
		exchange_url = 'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=' + oauth._clientId + '&client_secret=' + oauth._clientSecret;

  oauth.setAccessTokenName('fb_exchange_token');

  if(token)
	  oauth.get(exchange_url, token, function(err, result, res){
	  	if(err) throw err;
	  	var token = result.split('&')[0].split('=')[1],
	  		code_url = 'https://graph.facebook.com/oauth/client_code?client_id=' + oauth._clientId + '&client_secret=' + oauth._clientSecret + '&redirect_uri=' + 'http://localhost:3000/link/facebook/callback';
	  		
	  	oauth.setAccessTokenName('access_token');


	  	oauth.get(code_url, token, function(err, result, res){
	  		req.query.code = JSON.parse(result).code;
	  		//override
	  		oauth.getOAuthAccessToken = function(code, params, callback){
				return callback(null, token, req.query.code, result)
			};

	  		facepass.prototype.authenticate.call(self, req, options);
	  	});
	  });

};

module.exports = Strategy;
















