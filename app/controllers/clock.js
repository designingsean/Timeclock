timeclock.controller('clock', function clock($scope, $http, payperiodFactory, totaltimeFactory) {
    $scope.currentUser = $scope.totalCurrent = $scope.totalPrevious = 0;
    $scope.clockedIn = false;

    //get the list of users
    $http.get("/timeclock/api/?action=usersGet&active=1").success(function(response) {
        $scope.users = response;
    });

    //get a users current status
    function currentStatus() {
        $http.get("/timeclock/api/index-old.php?action=getStatus&user=" + $scope.currentUser).success(function(response) {
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
            $scope.currentStatus = currentStatus;
        });
    }

    function getTimes(date) {
        var obj = {};
        var periodDates = payperiodFactory.periodDates(date);
        $http.get("/timeclock/api/?action=clockGet&user=" + $scope.currentUser + "&start=" + periodDates.firstWeekStart + "&end=" + periodDates.firstWeekEnd).success(function(response) {
            obj.firstWeekTotal = totaltimeFactory.getTotal(response);
            obj.firstWeek = response;
            obj.payperiodTotal = obj.firstWeekTotal;
        });
        $http.get("/timeclock/api/?action=clockGet&user=" + $scope.currentUser + "&start=" + periodDates.secondWeekStart + "&end=" + periodDates.secondWeekEnd).success(function(response) {
            obj.secondWeekTotal = totaltimeFactory.getTotal(response);
            obj.secondWeek = response;
            obj.payperiodTotal += obj.secondWeekTotal;
        });
        return obj;
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
            $scope.currentTimes = getTimes(Date.create());
            $scope.previousTimes = getTimes(Date.create().rewind({ days: 14 }));
        } else {
            reset();
        }
    };

    $scope.clock = function(inOut) {
        $http.get("/timeclock/api/index-old.php", { params: { action: inOut, user: $scope.currentUser } }).success($scope.getTimes).error(function() { alert("error"); });
    }

    $scope.reset = function() {
        reset();
    }
});