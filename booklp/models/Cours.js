var mongoose = require('mongoose');

var CourSchema = new mongoose.Schema({
	//champs de la base

	titre : String,
	prof : {
		id : {
			type: mongoose.Schema.Types.ObjectId, 
			ref:'User'
		},
		nom : String,
		prenom : String
	}
});

CourSchema.virtual('id').get(function(){
	return this._id;
});

var Cours = mongoose.model('Cours', CourSchema);