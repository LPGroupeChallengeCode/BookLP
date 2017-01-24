var mongoose = require('mongoose');

var CourSchema = new mongoose.Schema({
	//champs de la base
	Titre: String,
	Prof: {id : {type: mongoose.Schema.Types.ObjectId, ref:'nom, prenom'},
		username : String
	}
});

CourSchema.virtual('id').get(function(){
	return this._id;
});

var Cours = mongoose.model('Cours', CourSchema);