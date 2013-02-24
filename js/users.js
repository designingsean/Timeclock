function users($scope, $http) {
	$scope.newUser = '';
	
	getUsers();

	function getUsers() {
		//get the list of users
		$scope.newUser = '';

		$http.get("api/?action=getUsers").success(function(response) {
			$scope.activeUsers = response;
		});
		$http.get("api/?action=adminInactiveUsers").success(function(response) {
			$scope.inactiveUsers = response;
		});
	};

	$scope.addUser = function() {
		$http.get("api/", { params: { action: 'adminAddUser', user: $scope.newUser } }).success(getUsers).error(function() { alert("error"); });
	}

	$scope.updateUser = function(action, user) {
		if(action === 'activate') {
			$http.get("api/", { params: { action: 'adminUpdateUser', active: 1, id: user.id } }).success(getUsers).error(function() { alert("error"); });
		} else {
			$http.get("api/", { params: { action: 'adminUpdateUser', active: 0, id: user.id } }).success(getUsers).error(function() { alert("error"); });
		}
	}

}