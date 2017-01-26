var mongoose = require('mongoose');

var ListeSchema = new mongoose.Schema({
	cours: String,
	prof: {
		id : {
			type: mongoose.Schema.Types.ObjectId, 
			ref:'Prof'
		}
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
			ref : 'Etudiant'
		},
		etat : {
			type : String,
			enum : ['Present', 'Retard']
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

mongoose.model('Liste', ListeSchema);