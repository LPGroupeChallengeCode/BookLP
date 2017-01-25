var mongoose = require('mongoose');

var CourSchema = new mongoose.Schema({
	//champs de la base
	titre: {
		type : String,
		unique : true
	}
	prof: {
		id : {
			type: mongoose.Schema.Types.ObjectId, ref:'User'},
			username : String
		}
		nom : String,
		prenom : String
	}
});

CourSchema.virtual('id').get(function(){
	return this._id;
});

var Cours = mongoose.model('Cours', CourSchema);