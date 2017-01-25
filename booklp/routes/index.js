var express = require('express');
//var md5 = require('MD5');
var passport = require('passport');
var jwt = require('express-jwt');
var mongoose = require('mongoose');
/*var Liste = mongoose.model('Liste');
var User = mongoose.model('User');
var Cours = mongoose.model('Cours');*/
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//LOGIN
	router.post('/login', function(req, res, next){
		if(!req.body.username || !req.body.password){
			return res.status(400).json({message: 'Veuillez renseigner tous les champs'});
		}

		passport.authenticate('local', function(err, user, info){
			if(err){return next(err);}

			if(user){
				return res.json({token: user.generateJWT()});
			}else{
				return res.status(401).json(info);
			}
		})(req, res, next);
	});

//PRESENCE
	router.put('/liste/:id/etudiant', auth, function(req, res, next){
		Liste.findById(req.params.id, function(err, liste){
			if(err){console.log(err); return next(err);}
			liste.etudiants = req.body.etudiant;
			liste.save(function(err, liste){
				if(err){console.log(err); return next(err);}
				res.json(liste);
			});
		});
	});

//CREATION COURS
router.post('/cours', function(req, res, next){
	
	// creation objet
	var cours = new Cours(req.body);
	//assignation valeurs
	cours.prof.id = req.payload._id;
	cours.titre = req.payload.titre;
	//save
	cours.save(function(err, cours){
		if(err){console.log(err);
			return next(err);}
	});
	//res.json({test : req.body.test});
});

//CREATION LISTE
router.post('/liste', function(req, res, next){
	
	// creation objet
	var liste = new Liste(req.body);
	//assignation valeurs
	liste.prof.nom = req.payload.nom;
	liste.date = req.payload.date;
	liste.heure = req.payload.heure;
	liste.periode = req.payload.periode;
	//save
	liste.save(function(err, liste){
		if(err){console.log(err);
			return next(err);}
	});
});

//AFFICHAGE ALL LISTE ETUDIANT
router.get('/listes', function(req, res, next){

	//recup info
	Liste.find(function(err, listes){
		if(err){console.log(err);
			return next(err);}
	//Envoie rep
		res.json(listes);
	});
});

//AFFICHAGE ALL LISTE PROF
router.get('/listes/:id/prof', function(req, res, next){

	//recup info
	Liste.findById({'prof.id': req.params.id}, function(err, listes){
		if(err){console.log(err);
			return next(err);}
	//Envoie rep
		res.json(listes);
	});
});

//AFFICHAGE LISTE
router.get('/myListe/:id', function(req, res, next){
	//recup info
	Liste.findById({'prof.id': req.params.id}, function(err, listes){
		if(err){console.log(err); return next(err);}
	//Envoie rep
	res.json(listes);
	});
});

//AFFICHAGE COURS
router.get('/mycours/:id', function(req, res, next){
	//recup info
	Cours.findById({'prof.id': req.params.id}, function(err, cours){
		if(err){console.log(err); return next(err);}
	//Envoie rep
	res.json(cours);
	});
});


module.exports = router;
