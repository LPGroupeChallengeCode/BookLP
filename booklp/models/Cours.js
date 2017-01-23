var mongoose = require('mongoose');

var CourSchema = new mongoose.Schema({
	//champs de la base
});

CourSchema.virtual('id').get(function(){
	return this._id;
});

var Cours = mongoose.model('Cours', CourSchema);