timeclock.controller('clock', function clock($scope, usersApi, clockApi, payperiodFactory, totaltimeFactory) {
    $scope.currentUser = 0;
    $scope.clockedIn = false;

    //get the list of users
    usersApi.get(1).then(function(response) {
        $scope.users = response.data;
    });

    //get a users current status
    function getStatus(user) {
        var status;
        clockApi.getLast($scope.currentUser).then(function(response) {
            if (response.data.clockIn !== null && response.data.clockOut !== null) {
                status = "Clocked out " + moment(response.data.clockOut).fromNow();
                $scope.clockedIn = false;
            } else {
                status = "Clocked in " + moment(response.data.clockIn).fromNow();
                $scope.clockedIn = true;
            }
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
            $scope.currentTimes = getTimes(moment());
            $scope.previousTimes = getTimes(moment().day(-13));
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
            clockApi.clockOut($scope.currentUser, moment().format("YYYY-MM-DD HH:mm:ss")).then(function() {
                $scope.getTimes();
            });
        }
    };

    $scope.reset = function() {
        reset();
    };
});