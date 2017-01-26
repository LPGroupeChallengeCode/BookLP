var md5 = require('MD5');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
	function(username, password, done){
		User.findOne({username: username, password: md5(password)}, function(err, user){
			if(err){return done(err);}
			if(!user){
				return done(null, false,{message: 'Pseudo ou mot de passe incorrect'});
			}
			return done(null, user);
		});
	}
));