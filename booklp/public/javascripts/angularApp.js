var app = angular.module('booklp', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
			//login
			.state('login', {
				url: '/login',
				templateUrl: '/login.html',
				controller: 'LoginCtrl',
				onEnter:['$state', 'auth', 
				function($state, auth){
					if(auth.isLoggedIn()){
						if(auth.isProf()){
							$state.go('espaceProf');
						}
						else{
							$state.go('espaceEtudiant');
						}
					}
				}]
			})
			//espace prof
			.state('espaceProf',{
				url: '/espaceProf',
				templateUrl: '/espaceProf.html',
				controller: 'EspaceProfCtrl',
				resolve:{
					courPromise: ['cours',
					function(cours){
						return cours.getAll();
					}]
				}
			})
			//espace etudiant
			.state('espaceEtudiant',{
				url: '/espaceEtudiant',
				templateUrl: '/espaceEtudiant.html',
				controller: 'EspaceEtudiantCtrl',
				resolve:{
					listePromise: ['listes',
					function(listes){
						return listes.getAll();
					}]
				}
			})
			//details liste
			.state('liste', {
				url: '/liste/:id',
				templateUrl: '/liste.html',
				controller: 'ListeDetailsCtrl',
				resolve: {
					liste: ['$stateParams', 'listes', 
					function($stateParams, listes){
						return listes.get($stateParams.id);
					}]
				}
			})
			//ajouter liste
			.state('ajouterListe', {
				url: '/ajouterListe',
				templateUrl: '/ajouterListe.html',
				controller: 'AjouterListeCtrl',
			})
			//mes listes
			.state('listes',{
				url: '/listes',
				templateUrl: '/listes.html',
				controller: 'ListesCtrl',
				resolve: {
					listePromise: ['listes',
					function(listes){
						return listes.getAll();
					}]
				}
			})
			//ajouter cours
			.state('ajouterCours', {
				url: '/ajouterCours',
				templateUrl: '/ajouterCours.html',
				controller: 'AjouterCoursCtrl'
			})
		$urlRouterProvider.otherwise('login');
	}]);

/*******************************************************************/
/************************** FACTORY ********************************/
/*******************************************************************/


/************************** AUTH ***********************************/

app.factory('auth', ['$http', '$window',
	function($http, $window){
		var auth = {};

		auth.saveToken = function(token){
			$window.localStorage['booklp-token'] = token;
		};

		auth.getToken = function(){
			return $window.localStorage['booklp-token'];
		};

		auth.isLoggedIn = function(){
			var token = auth.getToken();

			if(token){
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return payload.exp > Date.now() / 1000;
			}else{
				return false;
			}
		};

		auth.isProf = function(){
			if(auth.isLoggedIn()){
				var token = auth.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				
				if(payload.role === "Prof"){
					return true;
				}
				else{
					return false;
				}
			}
		};

		auth.currentUser = function(){
			if(auth.isLoggedIn()){
				var token = auth.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]));

				return payload._id;
			}
		};

		auth.currentUserName = function(){
			if(auth.isLoggedIn()){
				var token = auth.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]));

				return payload.nom;
			}
		};

		auth.logIn = function(user){
			return $http.post('/login', user).success(function(data){
				auth.saveToken(data.token);
			});
		};

		auth.logOut = function(){
			$window.localStorage.removeItem('booklp-token');
			$window.location = '#/login';
		};

		return auth;
	}
	
]);

/************************** LISTE **********************************/

app.factory('listes', ['$http', '$window', 'auth',
	function($http, $window, auth){
	var o = {
		listes: []
	};

	//afficher toutes les listes
	o.getAll = function(){
		return $http.get('/listes').success(function(data){
			angular.copy(data, o.listes);
		});
	};

	//afficher listes du prof
	o.getProfListes = function(id){
		return $http.get('/mesListes/'+id).success(function(data){
			angular.copy(data, o.listes);
		});
	};

	//afficher la liste
	o.get = function(id){
		return $http.get('/liste/'+id).then(function(res){
			return res.data;
		});
	};

	//creer liste
	o.ajouterListe = function(liste){
		return $http.post('/liste', liste, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
			o.listes.push(data);
			$window.location ='#/espaceProf';
		});
	};

	//valider presence
	o.setStudentState = function(id, student){
		return $http.post('/liste/'+id+'/student', student, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		});
	};

	//cloturer liste
	o.closeListe = function(liste){
		return $http.put('/liste/'+liste._id+'/status', null, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
			}).success(function(data){
				if(liste.status === 'OPEN'){
					liste.status = 'LATE';
				}
				else{
					liste.status = 'CLOSE';
				}
				$window.location = '#/espaceProf';
			}
		);
	};

	//imprimer/exporter liste

	o.exportListe = function(){

	};

	return o;
}]);

/************************** ELEVE **********************************/

/************************** COURS **********************************/

app.factory('cours', ['$http', '$window', 'auth',
	function($http, $window, auth){
	var o = {
		cours: []
	};

	//afficher tous les cours
	o.getAll = function(){
		return $http.get('/cours').success(function(data){
			angular.copy(data, o.cours);
		});
	};

	//afficher cours du profs
	o.getMesCours = function(id){
		return $http.get('/mesCours/'+id).success(function(data){
			angular.copy(data, o.cours);
		});
	};

	//creer un cours
	o.ajouterCours = function(cour){
		return $http.post('/cours', cour, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
			o.cours.push(data);
			$window.location = '#/espaceProf';
		});
	}

	return o;
}]);

/*******************************************************************/
/************************** CONTROLLER *****************************/
/*******************************************************************/

//controleur navbar
app.controller('NavCtrl', [
	'$scope',
	'auth',
	function($scope, auth){
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.isProf = auth.isProf;
		$scope.logOut = auth.logOut;
	}]);

//controller login
app.controller('LoginCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth){
		$scope.user = {};

		$scope.logIn = function(){
			auth.logIn($scope.user).catch(function(error){
				$scope.error = error;
			}).then(function(){
				//go selon role
				$scope.isProf = auth.isProf;
				if($scope.isProf()){
					$state.go('espaceProf');
				}
				else if(!$scope.isProf()){
					$state.go('espaceEtudiant');
				}
				//$state.go('espaceEtudiant');
			});
		};
	}]);

//controller prof : affichage de ses cours
app.controller('EspaceProfCtrl',[
	'$scope',
	'cours',
	'auth',
	function($scope, cours, auth){
		$scope.cours = cours.cours;
		$scope.currentUserName = auth.currentUserName;
		$scope.currentUser = auth.currentUser;
	}]);

//controller etudiant: affichage des listes
app.controller('EspaceEtudiantCtrl',[
	'$scope',
	'listes',
	'auth',
	function($scope, cours, auth){
		$scope.listes = cours.listes;
		$scope.currentUserName = auth.currentUserName;
	}]);

//controller liste
app.controller('ListeDetailsCtrl',[
	'$scope',
	'listes',
	'liste',
	'auth',
	function($scope, listes, liste, auth){
		$scope.liste = liste;
		$scope.isProf = auth.isProf;
		$scope.currentUserName = auth.currentUserName;
		$scope.currentUser = auth.currentUser;
		
		//affichage bouton selon role
		$scope.CloseButton = false;
		$scope.PresentButton = false;
		$scope.RetardButton = false;

		if($scope.liste.status === "OPEN"){
			$scope.button = 'Passer aux retards'
			$scope.CloseButton = true;
			$scope.PresentButton = true;
		}
		if($scope.liste.status === "LATE"){
			$scope.button = 'Clore la liste';
			$scope.CloseButton = true; 
			$scope.PresentButton = false; 
			$scope.RetardButton = true
		}
		if($scope.liste.status === "CLOSE"){
			$scope.CloseButton = false;
			$scope.RetardButton = false;
			$scope.PresentButton = false;
		}

		$scope.closeListe = function(){
			listes.closeListe(liste);
			if($scope.liste.status === "LATE"){
				$scope.CloseButton = true;
				$scope.PresentButton = false;
				$scope.RetardButton = true
			}
			if($scope.liste.status === "CLOSE"){
				$scope.CloseButton = false; 
				$scope.PresentButton = false;
				$scope.RetardButton = false;
			}
		};

		$scope.setStudentState = function(){
			
			if($scope.liste.status === "OPEN"){

				listes.setStudentState(liste._id, {
					nom : $scope.currentUserName
				}).success(function(student){
					//push student
					console.log("succes");
					$scope.liste.etudiants.push(student);
				});
				$scope.PresentButton = false;
			}
			/*else if($scope.liste.status === "LATE"){

				listes.setStudentState(liste);
				$scope.RetardButton = false;
			}*/
			
		};

	}])

//controller ajouter liste
app.controller('AjouterListeCtrl',[
	'$scope',
	'listes',
	'auth',
	function($scope, listes, auth){
		$scope.listes = listes.listes;
		
		$scope.currentUser = auth.currentUse;

		$scope.ajouterListe = function(){
			if(!$scope.periode || $scope.periode === ''){return;}

			listes.ajouterListe({
				//champs de la table liste
				cours : $scope.cours,
				periode : $scope.periode,
				status : 'OPEN'
			});
		};

		//vider les champs de la pages
	}]);

//controller mes listes
app.controller('ListesCtrl',[
	'$scope',
	'listes',
	'auth',
	function($scope, listes, auth){
		$scope.listes = listes.listes;
		$scope.currentUserName = auth.currentUserName;
	}]);

//controller ajouter cours
app.controller('AjouterCoursCtrl',[
	'$scope',
	'cours',
	'auth',
	function($scope, cours, auth){
		$scope.cours = cours.cours;
		$scope.currentUser = auth.currentUser;

		$scope.ajouterCours = function(){
			if(!$scope.titre || $scope.titre === ''){return;}
			cours.ajouterCours({
				//champs de la table liste
				titre : $scope.titre
			});
		};
		//vider les champs de la pages
		$scope.titre = '';

	}]);



