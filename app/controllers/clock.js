timeclock.controller('clock', function clock($scope, $http, usersApi, clockApi, payperiodFactory, totaltimeFactory) {
    $scope.currentUser = 0;
    $scope.clockedIn = false;

    //get the list of users
    usersApi.get(1).then(function(response) {
        $scope.users = response.data;
    });

    //get a users current status
    function getStatus(user) {
        var status;
        var time;
        clockApi.getLast($scope.currentUser).then(function(response) {
            if (response.data.clockIn !== null && response.data.clockOut !== null) {
                status = "Clocked out ";
                time = response.data.clockOut;
                $scope.clockedIn = false;
            } else {
                status = "Clocked in ";
                time = response.data.clockIn;
                $scope.clockedIn = true;
            }
            status = status + Date.create(time).relative(function(value, unit, ms, loc) {
                if (ms.abs() > (14).hour() && ms.abs() < (7).day()) {
                    return "on {Weekday} at {12hr}:{mm}{tt}";
                } else if (ms.abs() >= (7).day()) {
                    return "on {Weekday}, {Month} {d} at {12hr}:{mm}{tt}";
                }
            });
            $scope.currentStatus = status;
        });
    }

    function getTimes(date) {
        var obj = {};
        obj.payperiodTotal = 0;
        var periodDates = payperiodFactory.periodDates(date);
        clockApi.get($scope.currentUser, periodDates.firstWeekStart, periodDates.firstWeekEnd).then(function(response) {
            obj.firstWeekTotal = totaltimeFactory.getTotal(response.data);
            obj.firstWeek = response.data;
            obj.payperiodTotal += obj.firstWeekTotal;
        });
        clockApi.get($scope.currentUser, periodDates.secondWeekStart, periodDates.secondWeekEnd).then(function(response) {
            obj.secondWeekTotal = totaltimeFactory.getTotal(response.data);
            obj.secondWeek = response.data;
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
            getStatus($scope.currentUser);
            $scope.currentTimes = getTimes(Date.create());
            $scope.previousTimes = getTimes(Date.create().rewind({ days: 14 }));
        } else {
            reset();
        }
    };

    $scope.clock = function(inOut) {
        if(inOut === "clockIn") {
            clockApi.clockIn($scope.currentUser).then(function() {
                $scope.getTimes();
            });
        } else {
            clockApi.clockOut($scope.currentUser, Date.create().format("{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}")).then(function() {
                $scope.getTimes();
            });
        }
    };

    $scope.reset = function() {
        reset();
    };
});