var mongoose = require('mongoose');

var ListeSchema = new mongoose.Schema({
	//champs de la base
	cours: String,
	utilisateur: String,
	date: Date,
	periode: String,
	presence: String,
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