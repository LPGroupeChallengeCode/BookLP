var express = require('express');
var md5 = require('md5');
var passport = require('passport');
var jwt = require('express-jwt');
var mongoose = require('mongoose');
var Liste = mongoose.model('Liste');
var User = mongoose.model('User');
var Cours = mongoose.model('Cours');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//LOGIN
	router.post('/login', function(req, res, next){
		if(!req.body.username || !req.body.password){
			return res.status(400).json({message: 'Veuillez remplir tous les champs'});
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

//GET COURS
	router.get('/mycours/:id', function(req, res, next){
		//recup info
		Cours.findById({'prof.id': req.params.id}, function(err, cours){
			if(err){console.log(err); return next(err);}
			//Envoie rep
			res.json(cours);
		});
	});

//POST COURS
	router.post('/cours', auth, function(req, res, next){
	
		// creation objet
		var cour = new Cours(req.body);
		//assignation valeurs
		cour.prof.id = req.payload._id;
		cour.titre = req.body.titre;
		//save
		cour.save(function(err, cours){
			if(err){console.log(err); return next(err);}

			User.findById(cour.prof.id, function(err, user){
				if(err){console.log(err); return next(err);}
				user.cours.push(cour);
				user.save(function(err, user){
					if(err){console.log(err); return next(err);}
					res.json(cour);
				});
			});
		});
	});

//preloading liste 
	router.param('liste', function(req, res, next, id){
		var query = Liste.findById(id);

		query.exec(function(err, liste){
			if(err){console.log(err); return next(err);}
			if(!liste){console.log(err); return next(new Error('Liste introuvable'));}

			req.liste = liste;
			return next();
		});
	});

//GET LISTES
	router.get('/listes', function(req, res, next){

		//recup info
		Liste.find(function(err, listes){
			if(err){console.log(err); return next(err);}
		//Envoie rep
			res.json(listes);
		});
	});

//GET LISTE
	router.get('/liste/:liste', function(req, res){
		req.liste.populate('etudiants', function(err, liste){
			if(err){console.log(err); return next(err);}
			res.json(liste);
		});
	});
	
//GET MES LISTES
	router.get('/mesListes/:id', function(req, res, next){
		//recup info
		Liste.findById({'prof.id': req.params.id}, function(err, listes){
			if(err){console.log(err); return next(err);}
		//Envoie rep
		res.json(listes);
		});
	});

//POST LISTE
	router.post('/liste', auth, function(req, res, next){
	
		// creation objet
		var liste = new Liste(req.body);
		//assignation valeurs
		liste.cours = req.body.cours
		liste.prof.id = req.payload._id;
		liste.date = req.body.date;
		liste.periode = req.body.periode;
		//save
		liste.save(function(err, liste){
			if(err){console.log(err); return next(err);}

			User.findById(liste.prof.id, function(err, user){
				if(err){console.log(err); return next(err);}
				user.listes.push(liste);
				user.save(function(err, user){
					if(err){console.log(err); return next(err);}
					res.json(liste);
				});
			});	
		});
	});

//PUT PRESENCE ELEVE
	router.put('/liste/:id/student', auth, function(req, res, next){
		
		Liste.findById(req.params.id, function(err, liste){
			if(err){console.log(err); return next(err);}

			liste.etudiants.id = req.payload._id;
			liste.etudiants.etat = req.body.etat;
			liste.etudiants.date = req.body.date;
			liste.save(function(err, liste){
				if(err){console.log(err); return next(err);}
				res.json(liste);
			});
		});

	});

//PUT ETAT LISTE
	router.put('/liste/:liste/student', auth, function(req, res, next){
		
		req.liste.status(function(err, liste){
			if(err){console.log(err); return next(err);}
			req.liste.etudiants.etat = req.body.etat;
			req.liste.etudiants.date = req.body.date;

			req.liste.save(function(err, liste){
				if(err){console.log(err); return next(err);}
				res.json(liste);
			});
		});
	});

module.exports = router;
