var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var options = {discriminatorKey: 'role'};

var UserSchema = new mongoose.Schema({
	//champs de la base
	numero : {
		type : String,
		unique : true
	},
	nom : String,
	prenom : String,
	pseudo : {
		type : String,
		unique : true
	}
	password : String,
	role :{
		type : String,
		enum : ['Prof', 'Etudiant']
	},
	listes : [{
		type: mongoose.Schema.Types.ObjectId, 
		ref:'Liste'
	}],
	cours : [{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Cours'
	}]
});

UserSchema.virtual('id').get(function(){
	return this._id;
});

UserSchema.methods.generateJWT = function(){
	var today = new Date();
	var exp =  new Date(today);
	exp.setDate(today.getDate()+60);

	return jwt.sign({
		_id: this._id,
		username: this.username,
		role: this.role,
		nom: this.nom,
		prenom: this.prenom,
		numero: this.numero,
		exp: parseInt(exp.getTime()/1000),
	}, 'SECRET');
};

var User = mongoose.model('User', UserSchema);