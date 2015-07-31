var util = require('util'),
	passface = require('passport-facebook');


function Strategy(options, verify){
	this.options = options || {};
	
	passface.call(this, this.options, verify);
}

util.inherits(Strategy, passface);

Strategy.prototype.authenticate = function(req, options) {
	var self = this,
		oauth = this._oauth2,
  		token = req.query.token,
		exchange_url = 'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=' + oauth._clientId + '&client_secret=' + oauth._clientSecret;

  oauth.setAccessTokenName('fb_exchange_token');

  if(token){
	  oauth.get(exchange_url, token, function(err, result, res){
	  	if(err) {
	  		//user not validated
	  		return console.log(err)
	  	}

	  	var token = result.split('&')[0].split('=')[1],
	  		cbPath = 'http://' + req.headers.host + (self.options.callbackPath || '/auth/facebook/callback'),
	  		code_url = 'https://graph.facebook.com/oauth/client_code?client_id=' + oauth._clientId + '&client_secret=' + oauth._clientSecret + '&redirect_uri=' + cbPath;
	  		
	  	oauth.setAccessTokenName('access_token');


	  	oauth.get(code_url, token, function(err, result, res){
	  		req.query.code = JSON.parse(result).code;
	  		//override
	  		oauth.getOAuthAccessToken = function(code, params, callback){
				return callback(null, token, req.query.code, result)
			};

	  		passface.prototype.authenticate.call(self, req, options);
	  	});
	  });
	}

};

module.exports = Strategy;
















