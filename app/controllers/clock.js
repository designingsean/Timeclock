timeclock.controller('clock', function clock($scope, $http, usersApi, clockApi, payperiodFactory, totaltimeFactory) {
    $scope.currentUser = 0;
    $scope.clockedIn = false;

    //get the list of users
    usersApi.get(1, function(err, response) {
        $scope.users = response;
    });

    //get a users current status
    function currentStatus() {
        clockApi.getLast($scope.currentUser, function(err, response) {
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
        clockApi.get($scope.currentUser, periodDates.firstWeekStart, periodDates.firstWeekEnd, function(err, response) {
            obj.firstWeekTotal = totaltimeFactory.getTotal(response);
            obj.firstWeek = response;
            obj.payperiodTotal = obj.firstWeekTotal;
        });
        clockApi.get($scope.currentUser, periodDates.secondWeekStart, periodDates.secondWeekEnd, function(err, response) {
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
        $scope.currentUser = 0;
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
        //$http.get("/timeclock/api/index-old.php", { params: { action: inOut, user: $scope.currentUser } }).success($scope.getTimes).error(function() { alert("error"); });
        if(inOut === "clockIn") {
            clockApi.clockIn($scope.currentUser, function(err, response) {
                $scope.getTimes();
            });
        } else {
            clockApi.clockOut($scope.currentUser, function(err, response) {
                $scope.getTimes();
            });
        }
    };

    $scope.reset = function() {
        reset();
    }
});