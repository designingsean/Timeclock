function admin($scope, $http) {
	$scope.currentUser = $scope.totalCurrent = $scope.totalPrevious = 0;
	$scope.clockedIn = false;
	$scope.clockDate = $scope.clockStart = $scope.clockEnd = '';
	
	//get the list of users
	$http.get("api/?action=getUsers").success(function(response) {
		$scope.users = response;
	});

	//get a users current status
	function currentStatus() {
		$http.get("api/?action=getStatus&user=" + $scope.currentUser).success(function(response) {
			var currentStatus;
			var time;
			if (response === null || (response.clockIn !== null && response.clockOut !== null) ) {
				currentStatus = "Clocked out ";
				time = response.clockOut;
				$scope.clockedIn = false;
			} else {
				currentStatus = "Clocked in ";
				time = response.clockIn;
				$scope.clockedIn = true;
			}
			currentStatus = currentStatus + Date.create(time).relative(function(value, unit, ms, loc) {
				if (ms.abs() > (14).hour() && ms.abs() < (7).day()) {
					return "on {Weekday} at {12hr}:{mm}{tt}";
				} else if (ms.abs() >= (7).day()) {
					return "on {Weekday}, {Month} {d} at {12hr}:{mm}{tt}";
				}
			});
			$scope.currentStatus = currentStatus
		});
	}

	//get the current paycheck's hours
	function getCurrent() {
		$http.get("api/?action=getCurrent&user=" + $scope.currentUser).success(function(response) {
			response[0].weekTotal = getTotal(response[0]);
			response[1].weekTotal = getTotal(response[1]);
			$scope.currentTimes = response;
			$scope.totalCurrent = getTotal(response[0]) + getTotal(response[1]);
		});
	}

	//get the previous paycheck's hours
	function getPrevious() {
		$http.get("api/?action=getPrevious&user=" + $scope.currentUser).success(function(response) {
			response[0].weekTotal = getTotal(response[0]);
			response[1].weekTotal = getTotal(response[1]);
			$scope.previousTimes = response;
			$scope.totalPrevious = getTotal(response[0]) + getTotal(response[1]);
		});
	}

	//gets total time for a paycheck
	function getTotal(obj) {
		var total = 0;
		angular.forEach(obj, function(value, key) {
			if (value.totalTime !== null)
				total += (value.totalTime).toNumber();
		});
		return total.round(2);
	}

	//resets back to basics
	function reset() {
		$scope.currentTimes = {};
		$scope.previousTimes = {};
		$scope.clockedIn = false;
		$scope.currentStatus = "";
		$scope.currentUser = $scope.totalCurrent = $scope.totalPrevious = 0;
	}

	$scope.getTimes = function() {
		if($scope.currentUser > 0) {
			currentStatus();
			getCurrent();
			getPrevious();
		} else {
			reset();
		}
	};

	$scope.addEntry = function() {
		var start = Date.create($scope.clockDate + ' ' + $scope.clockStart).format('{yyyy}-{MM}-{dd} {HH}:{mm}:00');
		var end = Date.create($scope.clockDate + ' ' + $scope.clockEnd).format('{yyyy}-{MM}-{dd} {HH}:{mm}:00');
		$http.get("api/", { params: { action: 'adminAdd', user: $scope.currentUser, start: start, end: end } }).success($scope.getTimes).error(function() { alert("error"); });
	}

	$scope.removeEntry = function(cT) {
		$http.get("api/", { params: { action: 'adminDelete', id: cT.id } }).success($scope.getTimes).error(function() { alert("error"); });
	}

	$scope.reset = function() {
		reset();
	}
}