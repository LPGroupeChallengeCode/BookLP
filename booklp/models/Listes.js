var mongoose = require('mongoose');

var ListeSchema = new mongoose.Schema({
	cours: String,
	prof: String,
	date: {
		type : Date,
		default : Date.now
	},
	periode: {
		type : String,
		enum : ['Matin', 'Apres-Midi']
	},
	etudiants : [{
		nom : String,
		prenom : String,
		numero : String,
		etat : {
			type : String,
			default : 'Present'
		},
		date :{
			type : Date,
			default : Date.now
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

ListeSchema.methods.changePresence = function(st){
	this.etudiants.etat = 'Present';
	this.save(st);
}

mongoose.model('Liste', ListeSchema);