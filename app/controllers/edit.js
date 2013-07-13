timeclock.controller('edit', function edit($scope, usersApi, clockApi, payperiodFactory, totaltimeFactory) {
    $scope.currentTimes = {};
    $scope.currentUser = 0;
    $scope.selectedDate = moment();
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.startTime = "";
    $scope.endTime = "";

    //get the list of users
    usersApi.get(1).then(function(response) {
        $scope.users = response.data;
    });

    function getTimes(date) {
        var obj = {};
        obj.payperiodTotal = 0;
        var periodDates = payperiodFactory.periodDates(date);
        $scope.startDate = periodDates.firstWeekStart;
        $scope.endDate = periodDates.secondWeekEnd;
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
        $scope.currentUser = 0;
        $scope.selectedDate = moment();
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.startTime = "";
        $scope.endTime = "";
    }

    $scope.getTimes = function() {
        if($scope.currentUser > 0) {
            $scope.currentTimes = getTimes($scope.selectedDate);
        } else {
            reset();
        }
    };

    $scope.addRow = function() {
        var start = moment($scope.selectedDate + " " + $scope.startTime, "YYYY-MM-DD h:mm a").format("YYYY-MM-DD HH:mm:ss");
        var end = moment($scope.selectedDate + " " + $scope.endTime, "YYYY-MM-DD h:mm a").format("YYYY-MM-DD HH:mm:ss");
        clockApi.add($scope.currentUser, start, end).then(function() {
            $scope.currentTimes = getTimes($scope.selectedDate);
            $scope.startTime = "";
            $scope.endTime = "";
        });
    };

    $scope.removeRow = function(id) {
        clockApi.remove(id).then(function() {
            $scope.currentTimes = getTimes($scope.selectedDate);
        });
    };

    $scope.reset = function() {
        reset();
    };
});