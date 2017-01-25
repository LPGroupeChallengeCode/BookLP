var mongoose = require('mongoose');

var CourSchema = new mongoose.Schema({
	//champs de la base
<<<<<<< HEAD
	titre : String,
	prof : {
		id : {
			type: mongoose.Schema.Types.ObjectId, 
			ref:'User'
		},
=======
	titre: {
		type : String,
		unique : true
	}
	prof: {
		id : {
			type: mongoose.Schema.Types.ObjectId, ref:'User'},
			username : String
		}
>>>>>>> b44aa086d21f5456d8a0420aa8eaa6f2bef4a2a3
		nom : String,
		prenom : String
	}
});

CourSchema.virtual('id').get(function(){
	return this._id;
});

var Cours = mongoose.model('Cours', CourSchema);