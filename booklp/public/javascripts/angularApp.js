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
			});
			//espace prof
			.state('espaceProf',{
				url: '/espaceProf',
				templateUrl: '/espaceProf.html',
				controller: 'EspaceProfCtrl',
				resolve:{
					courPromise: ['$stateParams', 'cours', 
					function($stateParams, cours){
						return cours.getMesCours($stateParams.id);
					}]
				}
			})
			//espace etudiant
			.state('espaceEtudiant',{
				url: '/espaceEtudiant',
				templateUrl: '/espaceEtudiant.html',
				controller: 'EspaceEtudiantCtrl',
				resolve:{
					courPromise: ['cours',
					function(cours){
						return cours.getAll();
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
						return listes.getCurrentListe($stateParams.id);
					}]
				}
			})
			//ajouter liste
			.state('ajouterListe', {
				url: '/ajouterListe',
				templateUrl: '/ajouterListe.html',
				controller: 'AjouterListeCtrl'
			})
			//mes listes
			.state('mesListes',{
				url: '/myListes/:id',
				templateUrl: '/mesListes.html',
				controller: 'MesListesCtrl',
				resolve: {
					listePromise: ['$stateParams', 'listes',
					function($stateParams, listes){
						return listes.getMine($stateParams.id);
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

	//afficher listes du prof
	o.getProfListes = function(id){
		return $http.get('/mesListes/'+id).success(function(data){
			angular.copy(data, o.listes);
		});
	};

	//afficher la liste ouverte
	o.getCurrentListe = function(id){
		return $http.get('/listeOuverte/'+id).success(function(data){
			angular.copy(data, o.listes);
		});
	};

	//creer liste
	o.createListe = function(){
		return $http.post('/listes', liste, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
			o.listes.push(data);
			$window.location('#/espaceProf')
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
				if(ticket.status === 'OPEN'){
					ticket.status = 'CLOSE';
				}
			}
		);
	};

	//imprimer/exporter liste
	o.printListe = function(){

	};

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
	o.createCours = function(){
		return $http.post('/cours', cour, {
			headers: {Authorization: 'Bearer '+auth.getToken()}
		}).success(function(data){
			o.cours.push(data);
			$window.location('#/espaceProf')
		});
	}

	return o;
}]);

/*******************************************************************/
/************************** CONTROLLER *****************************/
/*******************************************************************/

//controller login
app.controller('LoginCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth){
		$scope.user = {};

		$scope.logIn = function(){
			auth.logIn($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});
		};
	}]);

//controller prof

//controller etudiant

//controller liste

//controller ajouter liste

//controller mes listes

//controller ajouter cours