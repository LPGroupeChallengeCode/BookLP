var mongoose = require('mongoose');

var ListeSchema = new mongoose.Schema({
	//champs de la base
	cours: String,
	prof: {
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