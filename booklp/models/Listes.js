var mongoose = require('mongoose');

var ListeSchema = new mongoose.Schema({
	//champs de la base
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