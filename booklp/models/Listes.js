var mongoose = require('mongoose');

var ListeSchema = new mongoose.Schema({
	//champs de la base
<<<<<<< HEAD
	cours: String,
	prof:{
		id : {
			type: mongoose.Schema.Types.ObjectId, 
			ref:'User'
		},
		nom : String,
		prenom : String
	},
	date: {
		type : Date,
		default : Date.now
	},
	periode: {
		type : String,
		enum : ['Matin', 'Apres-Midi']
	},
	etudiants : [{
		id : {
			type: mongoose.Schema.Types.ObjectId,
			ref : 'User'
		},
		nom : String,
		prenom : String,
		numero : String
		etat : {
			type : String,
			enum : ['Present', 'Absent', 'Retard']
		}
	}],
	status : {
		type : String,
		default : "OPEN"
=======
	cours : String,
	prof : {
		id : {
			type: mongoose.Schema.Types.ObjectId, ref:'User',
			username : String
		}
		nom : String,
		prenom : String
	},
	date : { 
		type: Date, 
		default: Date.now
	},
	periode : {
		type: String, 
		enum: ['Matin', 'Apres-Midi']
	},
	etudiants : [{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User'
	}],
	status :  {
		type: String, 
		default: 'OPEN'
>>>>>>> b44aa086d21f5456d8a0420aa8eaa6f2bef4a2a3
	}
});

ListeSchema.virtual('id').get(function(){
	return this._id;
});

ListeSchema.methods.changeStatus = function(st){
	if(this.status === 'OPEN'){
		this.status = 'CLOSE';
		this.save(st);
	};
};

mongoose.model('Liste', ListeSchema);